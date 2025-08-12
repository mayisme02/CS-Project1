import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="container">
      <img src="/01.png" alt="รูปหมา" className="dog-img" />

      <h1 className="title">Hey! Welcome</h1>
      <p className="subtitle">
        While You Sit And Stay - We’ll Go Out And Play
      </p>

      <a href="/login" className="btn">GET STARTED</a>
      <Outlet />
    </div>
  );
}

export default App;
