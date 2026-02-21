import React, { useState } from 'react';
import './RDashboard.css';
import Rsidebar from './Rsidebar';
import Rnavbar from './Rnavbar';
import { Outlet } from 'react-router-dom';

function RdashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ Sidebar is open by default
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-wrapper">
      <Rsidebar sidebarOpen={sidebarOpen} />

      <div className={`main-section ${sidebarOpen ? 'shifted' : ''}`}>
        <Rnavbar toggleSidebar={toggleSidebar} />

        <div className="content-area p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default RdashboardLayout;
