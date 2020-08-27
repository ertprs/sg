import React from 'react';
import { Provider } from 'react-redux';

import Loading from './components/Loading';
import ToastApp from './components/ToastApp';

import Routes from './Routes'
import store from './store';


function App() {
  return (
    <Provider store={store}>
      <Routes />
      <Loading />
      <ToastApp />
    </Provider>
  );
}

export default App;
