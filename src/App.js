// Imports
import React from 'react';

// Styles
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

//Components
import Home from './features/Home/Home';
import { ToastContainer } from 'react-toastify';
import TopNav from './components/TopNav/TopNav';
import GoToTopBtn from './components/GoToTopBtn/GoToTopBtn';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <TopNav />
      <div className='content-container'>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/category' exact component={null} />
          <Redirect from='*' exact to='/' />
        </Switch>
      </div>
      <GoToTopBtn />
      <ToastContainer />
    </Router>
  );
}

export default App;
