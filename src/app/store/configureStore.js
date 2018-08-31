import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import firebase from '../config/firebase';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

const rrfConfig = {
  userProfile: 'users',
  attachAuthIsReady: true,
  useFirestoreForProfile: true,
  updateProfileOnLogin: false
};

export const configureStore = (preloadedState) => {
  const middleware = [thunk.withExtraArgument({getFirebase, getFirestore})];
  const middlewareEnhancer = applyMiddleware(...middleware);

  const storeEnhancers = [middlewareEnhancer];
  const cmposedEnhancer = composeWithDevTools(
    ...storeEnhancers, 
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
  );

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