import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    if (token && userId) {
      fetch(`https://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          return response.json();
        })
        .then((data) => {
          setUserEmail(data.email);
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
              <div className="user-menu">
                <button onClick={toggleDropdown} className="user-button">
                  <div className="hamburger-icon">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <p>User email: {userEmail}</p>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                  </div>
                )}
              </div>
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
