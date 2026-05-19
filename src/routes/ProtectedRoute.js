import React from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRole } from '../utils/authorization';

// Protected Route Component with role-based access control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is specified, check if user has required role
  if (allowedRoles && !hasRole(user?.role, allowedRoles)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
      }}>
        <h1 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          You don't have permission to access this page.
        </p>
        <a href="/dashboard" style={{
          color: '#1e3a8a',
          textDecoration: 'none',
          fontWeight: '600',
        }}>
          Go back to Dashboard
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
