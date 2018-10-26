import React, { Component } from 'react';
import {Provider} from "react-redux";
import { store } from './store';
import AppCmp from './AppCmp';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppCmp />
      </Provider>
    );
  }
}

export default App;
