import React from 'react';
import { Provider } from 'react-redux';

import Routes from './Routes'
import store from './store';

import Loading from './components/Loading';
import ToastApp from './components/ToastApp';
import CallBack from './components/CallBack';


function App() {
  return (
    <Provider store={store}>
      <Routes />
      <Loading />
      <ToastApp />
      <CallBack />
    </Provider>
  );
}

export default App;
