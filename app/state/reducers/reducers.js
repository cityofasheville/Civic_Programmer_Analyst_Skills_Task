import { combineReducers } from 'redux';
import * as types from '../actions/ActionTypes';
import common from './CommonReducer';
import data from './DataReducer';

const rootReducer = combineReducers({
  common,
  data
})

export default rootReducer
