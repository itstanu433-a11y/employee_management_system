import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';
import DashboardHeader from '../components/DashboardHeader';
import StatCard from '../components/StatCard';
import DepartmentChart from '../components/DepartmentChart';
import JoiningTrendChart from '../components/JoiningTrendChart';

const Dashboard = () => {
  const { user } = useAuth();

  // Sample data for dashboard
  const stats = [
    {
      title: 'Total Employees',
      value: 5,
      icon: '👥',
      color: 'blue',
    },
    {
      title: 'Total Departments',
      value: 4,
      icon: '🏢',
      color: 'green',
    },
    {
      title: 'Active Employees',
      value: 4,
      icon: '✅',
      color: 'emerald',
    },
    {
      title: 'On Leave',
      value: 1,
      icon: '🏖️',
      color: 'orange',
    },
  ];

  return (
    <div className="dashboard">
      <DashboardHeader title="Dashboard" subtitle="Welcome back!" />

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Department Distribution</h3>
          <DepartmentChart />
        </div>
        <div className="chart-container">
          <h3>Monthly Joining Trend</h3>
          <JoiningTrendChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
