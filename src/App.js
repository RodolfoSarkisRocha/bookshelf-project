import React from 'react';
import TopNav from './components/TopNav/TopNav';
import './App.scss';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';

function App() {
  return (
    <Router>
      <TopNav />
      <div className='content-container'>
        <Redirect from='*' to='/' />
      </div>
    </Router>
  );
}

export default App;
