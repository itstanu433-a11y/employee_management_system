import React from 'react';
import '../styles/components.css';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'stat-blue',
    green: 'stat-green',
    emerald: 'stat-emerald',
    orange: 'stat-orange',
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
