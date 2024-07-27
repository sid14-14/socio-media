import React, { version } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from './state';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { //this is specifically for react persist
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist"; //all the info will be stored in global state in ind/src. any t  when a user close tab/browser it will still be stored. only way to get rid of it is clearing cache, this is good if you want to keep the info. contrary to sessionstorage which after a session goes away 
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

//react-redux and react-persist: both documentaton reffered to get these below lines
const persistConfig = { key: "root", storage, version: 1};
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>

    <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
