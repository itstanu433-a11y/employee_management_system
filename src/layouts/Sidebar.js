import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/authorization';
import '../styles/layout.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['ceo', 'manager', 'employee'] },
    { label: 'Employees', path: '/employees', icon: '👥', roles: ['ceo', 'manager'] },
    { label: 'Departments', path: '/departments', icon: '🏢', roles: ['ceo', 'manager'] },
    { label: 'Attendance', path: '/attendance', icon: '📅', roles: ['ceo', 'manager', 'employee'] },
    { label: 'My Leaves', path: '/leaves', icon: '🏖️', roles: ['ceo', 'manager', 'employee'] },
    { label: 'Approve Leaves', path: '/leave-management', icon: '✅', roles: ['ceo', 'manager'] },
    { label: 'Feedback', path: '/feedback', icon: '💬', roles: ['ceo', 'manager', 'employee'] },
    { label: 'Holidays', path: '/holidays', icon: '🎉', roles: ['ceo', 'manager', 'employee'] },
    { label: 'Performance Review', path: '/performance-review', icon: '⭐', roles: ['ceo', 'manager'] },
    { label: 'Transfer Employee', path: '/employee-transfer', icon: '↔️', roles: ['ceo', 'manager'] },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="logo">EMS</h1>
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <div className="user-info">
        <div className="user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        {!collapsed && (
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => (
          <button
            key={item.path}
            className="nav-item"
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
