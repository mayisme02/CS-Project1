import React from 'react';
import { Outlet } from 'react-router-dom'; // แสดง Route child

function App() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      {/* แสดงหน้า Login, Register ตาม route */}
      <Outlet />
    </div>
  );
}

export default App;
