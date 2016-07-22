import * as types from '../actions/ActionTypes';

export default function data (state = {datasets: {}}, action) {
  console.log("I have an action in DataReducer: " + action.type);
  //console.log("Current state = " + JSON.stringify(state));
  switch (action.type) {
    case types.FETCH_DATASET:
    {
      let tmpDatasets = {};
      tmpDatasets[action.data.dataset.tag] = {
        tag: action.data.dataset.tag,
        status: 'init',
        definition: action.data.dataset,
        count: 0,
        items: []
      };
      let newDatasets = Object.assign({}, state.datasets, tmpDatasets);
      return Object.assign({}, state, {datasets: newDatasets});
    }
    case types.UPDATE_DATASET:
    {
      console.log("Update dataset, operation = " + action.data.operation);
      let tmpDatasets = {};
      let ds = {...state.datasets[action.data.tag]};
      switch (action.data.operation) {
        case "count":
          ds.status = 'count';
          ds.count = action.data.count;
          console.log("Expected count is " + ds.count);
          break;

        case "add":
          ds.status = 'add';
          ds.items = [].concat(ds.items).concat(action.data.items);
          console.log("NOW ds items length = " + ds.items.length);
          break;

        case "finish":
          ds.status = 'finish';
          ds.items = [].concat(ds.items).concat(action.data.items);
          console.log("FINAL ds items length = " + ds.items.length);
          break;

        case "error":
          ds.status = 'error';
          ds.error = action.data.error;
          break;

        default:
          break;
      }
      tmpDatasets[ds.tag] = ds;
      let newDatasets = Object.assign({}, state.datasets, tmpDatasets);
      return Object.assign({}, state, {datasets: newDatasets});
    }
    default:
      break;
  }
  return state;
}
