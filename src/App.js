import React from 'react';
import TopNav from './components/TopNav/TopNav';
import './App.scss';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Home from './features/Home/Home';

function App() {
  return (
    <Router>
      <TopNav />
      <div className='content-container'>
        <Route path='/' component={Home} />
        <Redirect from='*' to='/' />
      </div>
    </Router>
  );
}

export default App;
