import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import moment from 'moment';
import ptbr from 'moment/locale/pt-br'
import Routes from './Routes'
import store from './store';

import Loading from './components/Loading';
import ToastApp from './components/ToastApp';
import CallBack from './components/CallBack';


function App() {
  useEffect(()=> {
    moment().locale('pt-br');
  },[])

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
