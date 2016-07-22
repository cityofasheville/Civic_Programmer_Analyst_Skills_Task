import * as actionTypes from './ActionTypes';

export function setErrorMessage(msg) {
  return {
    type: actionTypes.SET_ERROR_MESSAGE,
    data: {
      msg
    }
  }
}
