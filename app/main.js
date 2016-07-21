import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './state/configureStore'
import Dashboard from './DashBoard.js';

const store = configureStore();

render(
  <Provider store={store}>
    <Dashboard dispatch={store.dispatch}/>
  </Provider>,
  document.getElementById('avl-dashboard')
);
