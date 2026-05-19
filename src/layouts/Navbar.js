import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.css';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Employee Management System</h2>
      </div>
      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name || 'Admin'}</p>
            <p className="user-email">{user?.email || 'admin@gmail.com'}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
