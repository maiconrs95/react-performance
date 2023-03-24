import makeFilterCitiesWorker from 'workerize!./filter-cities'

console.log(makeFilterCitiesWorker)
const {getItems} = makeFilterCitiesWorker()

export {getItems}

/*
eslint
  import/no-webpack-loader-syntax: 0,
*/
