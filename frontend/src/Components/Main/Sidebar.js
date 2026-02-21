import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ sidebarOpen }) {
  return (
    <div className={`sidebar bg-dark text-white ${sidebarOpen ? 'open' : ''}`}>
      <div className="p-3">
        <h5>Admin Dashboard</h5>
        <ul className="nav flex-column mt-4">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/login/dashboard/reception">
              <i className="fas fa-concierge-bell me-2"></i>RECEPTION
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="add-employee">
              <i className="fas fa-user-plus me-2"></i>ADD EMPLOYEE
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="add-rooms">
              <i className="fas fa-bed me-2"></i>ADD ROOMS
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="add-driver">
              <i className="fas fa-car-side me-2"></i>ADD DRIVER
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
