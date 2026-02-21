import React, { useState } from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ Sidebar is open by default
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-wrapper">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className={`main-section ${sidebarOpen ? 'shifted' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="content-area p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
