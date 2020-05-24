import React from 'react';
import './App.css';
import { BrowserRouter, Route  } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import SignUp from './components/SignUp'
import AdminHome from './adminComp/AdminHome'
import InstructorHome from './InstructorComp/InstructorHome'
import AdminLogin from './adminComp/AdminLogin'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={SignUp} />
        <Route path='/adminLogin' component={AdminLogin} />
        <Route path='/adminHome' component={AdminHome} />
        <Route path='/instructorHome' component={InstructorHome} />
      </BrowserRouter>
    </div>
  );
}

export default App;
