import * as actionTypes from './ActionTypes';

export function setServerUrl(baseUrl) {
  return {type: actionTypes.SET_SERVER_URL, data: { baseUrl }}
}

export function setErrorMessage(msg) {
  return {
    type: actionTypes.SET_ERROR_MESSAGE,
    data: {
      msg
    }
  }
}
