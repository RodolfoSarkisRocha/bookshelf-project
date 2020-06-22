import React from 'react';
import TopNav from './components/TopNav/TopNav';
import './App.scss';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Home from './features/Home/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoToTopBtn from './components/GoToTopBtn/GoToTopBtn';

function App() {
  return (
    <Router>
      <TopNav />
      <div className='content-container'>
        <Route path='/' component={Home} />
        <Redirect from='*' to='/' />
      </div>
      <GoToTopBtn />
      <ToastContainer />
    </Router>
  );
}

export default App;
