import React from 'react';
import { Outlet, Link } from 'react-router-dom';  // เพิ่ม Link
import './App.css';

function App() {
  return (
    <div className="container">
      <img src="/01.png" alt="รูปหมา" className="dog-img" />

      <h1 className="title">Hey! Welcome</h1>
      <p className="subtitle">
        While You Sit And Stay - We’ll Go Out And Play
      </p>

      {/* ใช้ Link แทน a */}
      <Link to="/login" className="btn">GET STARTED</Link>

      <Outlet />
    </div>
  );
}

export default App;
