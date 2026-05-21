import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Check and update account lock status
  useEffect(() => {
    if (isAccountLocked && lockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setLockTimeRemaining(lockTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (lockTimeRemaining === 0 && isAccountLocked) {
      setIsAccountLocked(false);
      setLoginError(null);
    }
  }, [isAccountLocked, lockTimeRemaining]);

  // Login function with security features
  const login = async (email, password) => {
    try {
      setLoginError(null);

      // Check if account is locked
      if (isAccountLocked && lockTimeRemaining > 0) {
        const minutes = Math.ceil(lockTimeRemaining / 60);
        setLoginError(
          `Account temporarily locked. Try again after ${minutes} minute(s).`
        );
        return {
          success: false,
          message: `Account temporarily locked. Try again after ${minutes} minute(s).`,
          isLocked: true,
        };
      }

      // Validate email format
      if (!email || !email.includes('@')) {
        setLoginError('Please enter a valid email');
        return { success: false, message: 'Invalid email format' };
      }

      // Validate password
      if (!password || password.length === 0) {
        setLoginError('Password is required');
        return { success: false, message: 'Password is required' };
      }

      // Call login service
      const result = await authService.login(email, password);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setLoginError(null);
        setIsAccountLocked(false);
        setLockTimeRemaining(0);
        return { success: true };
      }

      // Handle failed login attempts
      if (result.userNotFound) {
        setLoginError('User does not exist in the system');
        return {
          success: false,
          message: 'User does not exist in the system',
        };
      }

      // Invalid credentials - track attempt
      const updatedResult = await authService.trackLoginAttempt(email);

      if (updatedResult.isLocked) {
        setIsAccountLocked(true);
        setLockTimeRemaining(300); // 5 minutes
        setLoginError(
          'Account temporarily locked due to multiple failed login attempts. Try again after 5 minutes.'
        );
        return {
          success: false,
          message:
            'Account temporarily locked due to multiple failed login attempts. Try again after 5 minutes.',
          isLocked: true,
        };
      }

      setLoginError(
        `Invalid credentials. ${5 - updatedResult.attempts} attempt(s) remaining before account lockout.`
      );
      return {
        success: false,
        message: `Invalid credentials. ${5 - updatedResult.attempts} attempt(s) remaining.`,
      };
    } catch (error) {
      setLoginError(error.message || 'Login failed');
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setLoginError(null);
    setIsAccountLocked(false);
    setLockTimeRemaining(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        loginError,
        isAccountLocked,
        lockTimeRemaining,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
