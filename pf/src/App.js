import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Studios from './components/Studios';
import Studio from './components/Studio';
import Navbar from './components/general/Navbar';
import Login from './components/Account/Login';
import View from './components/Account/View';
import Subscription from './components/Account/Subscription';
import Register from './components/Account/Register';
import React from 'react';
import Home from './components/Home';
import ClassHistory from './components/ClassHistory';

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
        <Routes>
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="studios" element={<Studios />} />
                <Route path="studios/:id" element={<Studio />} />
                <Route path="account/login" element={<Login/>}/>
                <Route path="account/view" element={<View/>}/>
                <Route path="account/register" element={<Register/>}/>
                <Route path="subscriptions" element={<Subscription/>}/>
                <Route path="account/classes" element={<ClassHistory/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
