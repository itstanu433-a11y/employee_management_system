import React from 'react';
import '../styles/components.css';

const DashboardHeader = ({ title, subtitle }) => {
  return (
    <div className="dashboard-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
