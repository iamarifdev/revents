import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers/rootReducer';

export const configureStore = (preloadedState) => {
  const middleware = [];
  const middlewareEnhancer = applyMiddleware(...middleware);

  const storeEnhancers = [middlewareEnhancer];

  const cmposedEnhancer = composeWithDevTools(...storeEnhancers);

  const store = createStore(
    rootReducer,
    preloadedState,
    cmposedEnhancer
  );

  if(process.env.NODE_ENV !== 'production'){
    if(module.hot) {
      module.hot.accept('../reducers/rootReducer.js', () => {
        const newRootReducer = require('../reducers/rootReducer').default;
        store.replaceReducer(newRootReducer);
      });
    }
  }

  return store;
};