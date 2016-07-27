import * as types from '../actions/ActionTypes';

export default function common (
    state = {
      errorMessage: null,
      baseServerUrl: null
    }, action) {
  switch (action.type) {
    case types.SET_ERROR_MESSAGE:
      return Object.assign({}, state, {errorMessage: action.data.msg});
    default:
      break;
  }
  return state;
}
