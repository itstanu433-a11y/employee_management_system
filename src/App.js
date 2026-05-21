import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import LeaveManagement from './pages/LeaveManagement';
import Feedback from './pages/Feedback';
import EmployeeProfile from './pages/EmployeeProfile';
import HolidayCalendar from './pages/HolidayCalendar';
import PerformanceReview from './pages/PerformanceReview';
import EmployeeTransfer from './pages/EmployeeTransfer';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          {/* Register Route */}
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Employees />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Departments />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Attendance />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <ProtectedRoute allowedRoles={['employee', 'manager', 'ceo']}>
                <MainLayout>
                  <Leaves />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-management"
            element={
              <ProtectedRoute allowedRoles={['manager', 'ceo']}>
                <MainLayout>
                  <LeaveManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={['employee', 'manager', 'ceo']}>
                <MainLayout>
                  <Feedback />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EmployeeProfile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/holidays"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HolidayCalendar />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance-review"
            element={
              <ProtectedRoute allowedRoles={['manager', 'ceo']}>
                <MainLayout>
                  <PerformanceReview />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-transfer"
            element={
              <ProtectedRoute allowedRoles={['manager', 'ceo']}>
                <MainLayout>
                  <EmployeeTransfer />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
