import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './state/configureStore'
import Dashboard from './DashBoard.js';
import dashboard_config from './dashboard_config';

/*
Tasks:
  - consider passing in config to dashboard along
    - Maybe the whole layout, components, everything OR
    - At least configuration stuff for each of the components
    - OR at least talk about options here.
  - Every component needs to know what to do if it can't find its dataset or if
    its dataset is not yet there.
*/
/*
 For now we'll just configure the datasets in code, but we
 can easily get this from a configuration file dynamically.
*/

const store = configureStore();

render(
  <Provider store={store}>
    <Dashboard dispatch={store.dispatch} config={dashboard_config}/>
  </Provider>,
  document.getElementById('avl-dashboard')
);
