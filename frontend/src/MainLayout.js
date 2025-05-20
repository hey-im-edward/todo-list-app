import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

function MainLayout({ children }) {
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role');
  const [active, setActive] = useState(window.location.pathname);

  useEffect(() => {
    setActive(window.location.pathname);
  }, [window.location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userExtensions');
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar username={username} role={role} onLogout={handleLogout} active={active} setActive={setActive} />
      <div style={{ flex: 1, padding: 32 }}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
