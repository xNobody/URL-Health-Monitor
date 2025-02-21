import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css'; // Import the CSS file

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
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/add-monitor">Add Monitor</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
