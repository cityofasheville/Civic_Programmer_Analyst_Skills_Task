import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/reducers';

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers/reducers', () => {
      const nextRootReducer = require('./reducers/reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store;
}
