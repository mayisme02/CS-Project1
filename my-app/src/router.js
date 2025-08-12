import React from 'react';
import { createBrowserRouter, Route, createRoutesFromElements } from "react-router-dom";
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import Resetpassword from './components/Resetpassword';


const routes = createRoutesFromElements(
  <>

    <Route path="/" element={<App />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/resetpassword" element={<Resetpassword />} />
  </>
);

const router = createBrowserRouter(routes);
export default router;
