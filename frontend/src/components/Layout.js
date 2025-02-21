import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <header>
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/url_health_monitor_logo_2.png" alt="Logo" className="logo" />
            </Link>
            <Link to="/">Dashboard</Link>
            <Link to="/add-monitor">Add Monitor</Link>
          </div>
          <div className="navbar-links">
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </nav>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
