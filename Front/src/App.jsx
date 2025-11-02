import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Frontpg from './Components/Frontpg/Frontpg';
import Login from "./Components/Authentication/Login";          
import SignUp from "./Components/Authentication/SignUp";
import VerifyCode from "./Components/Authentication/VerifyCode";
import ForgotAndResetPassword from "./Components/Authentication/ForgotAndResetPassword";
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpg />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyCode />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotAndResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App