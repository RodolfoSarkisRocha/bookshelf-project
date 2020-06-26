// Imports
import React from 'react';

// Styles
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Home from './features/Home/Home';
import Category from './features/Category/Category';
import TopNav from './components/TopNav/TopNav';
import GoToTopBtn from './components/GoToTopBtn/GoToTopBtn';
import { ToastContainer } from 'react-toastify';

// Router
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <TopNav />
      <div className='content-container'>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/category' component={Category} />
          <Redirect from='*' exact to='/' />
        </Switch>
      </div>
      <GoToTopBtn />
      <ToastContainer />
    </Router>
  );
}

export default App;
