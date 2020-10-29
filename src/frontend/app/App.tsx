import React from 'react';
import Navigation from '../components/navigation/Navigation'
import CoronaView from '../views/CoronaView'
import './App.css';

function App() {
  

    return (
      <div className="App">
          <Navigation />
          <div className="content">
            <CoronaView />
          </div>
      </div>
    );
}

export default App;
