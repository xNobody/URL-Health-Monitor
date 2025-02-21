import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="layout-container">
      {!isAuthPage && (
        <header>
          <nav className="navbar">
            <div className="navbar-brand">
              <Link to="/">
                <img src="/url_health_monitor_logo_2.png" alt="Logo" className="logo" />
              </Link>
            </div>
            <div className="navbar-tabs">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
              <Link to="/add-monitor" className={location.pathname === '/add-monitor' ? 'active' : ''}>Add Monitor</Link>
            </div>
            <div className="navbar-links">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </nav>
        </header>
      )}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
