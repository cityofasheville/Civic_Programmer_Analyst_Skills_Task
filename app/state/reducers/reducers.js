import { combineReducers } from 'redux';
import * as types from '../actions/ActionTypes';
import common from './CommonReducer';

const rootReducer = combineReducers({
  common
})

export default rootReducer
