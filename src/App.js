import React, { Component } from 'react';
import ComposedMap from './components/ComposedMap';
import MainMenu from './components/MainMenu';
import { AppProvider, AppConsumer } from './context/app-context';
import './App.css';

class App extends Component {
  render() {
    return (
      <AppProvider>
        <AppConsumer>
        { ({state, actions}) => (
          <div className='container'>
            <ComposedMap></ComposedMap>
          </div>
        )}
        </AppConsumer>
      </AppProvider>
    );
  }
}

export default App;