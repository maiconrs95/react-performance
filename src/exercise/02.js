// useMemo for expensive calculations
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {useCombobox} from '../use-combobox'
import {getItems} from '../filter-cities'
// import {getItems} from '../workerized-filter-cities'
import {useForceRerender} from '../utils'

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          selectedItem={selectedItem}
          highlightedIndex={highlightedIndex}
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}

Menu = React.memo(Menu)

function ListItem({
  getItemProps,
  item,
  index,
  selectedItem,
  highlightedIndex,
  ...props
}) {
  const isSelected = selectedItem?.id === item.id
  const isHighlighted = highlightedIndex === index
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          fontWeight: isSelected ? 'bold' : 'normal',
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
        },
        ...props,
      })}
    />
  )
}
ListItem = React.memo(ListItem, (prev, next) => {
  if (prev.getItemProps !== next.getItemProps) return false
  if (prev.items !== next.items) return false
  if (prev.index !== next.index) return false
  if (prev.selectedItem !== next.selectedItem) return false

  if (prev.highlightedIndex !== next.highlightedIndex) {
    const wasPrevHighlighted = prev.highlightedIndex === prev.index
    const isNowHighlighted = next.highlightedIndex === next.index
    return wasPrevHighlighted === isNowHighlighted
  }
  return true
})

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  // with web worker
  // const {data: allItems, run} = useAsync({data: [], status: 'pending'})
  // React.useEffect(() => {
  //   run(getItems(inputValue))
  // }, [inputValue, run])
  const allItems = getItems(inputValue)
  const items = allItems.slice(0, 100)

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  )
}

export default App
