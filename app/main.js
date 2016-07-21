import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import Dashboard from './DashBoard.js';

const  baseServerUrl = "http://ttp.dev/admin/1";

// Change second argument to a course ID to simulate single-course editor
const store = Dashboard.fetchData(baseServerUrl, -1);

render(
  <Provider store={store}>
    <Dashboard dispatch={store.dispatch}/>
  </Provider>,
  document.getElementById('avl-dashboard')
);
