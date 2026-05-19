import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/layout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="layout-content">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
