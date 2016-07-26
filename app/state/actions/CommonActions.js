import * as actionTypes from './ActionTypes';

// FIXTHIS if production
//  Need to do real error handling and add a place to display error message
//  to the user. Not hard, but I'll wait to see if this actually gets used.
export function setErrorMessage(msg) {
  return {
    type: actionTypes.SET_ERROR_MESSAGE,
    data: {
      msg
    }
  }
}
