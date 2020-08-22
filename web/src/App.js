import React from 'react';
import { Provider } from 'react-redux';

import Loading from './components/Loading';
import Routes from './Routes'
import store from './store';


function App() {
  return (
    <Provider store={store}>
      <Routes />
      <Loading />
    </Provider>
  );
}

export default App;
