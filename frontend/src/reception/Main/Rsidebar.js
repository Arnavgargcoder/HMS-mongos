// src/Components/Rsidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Rsidebar({ sidebarOpen }) {
  return (
    <div className={`sidebar bg-dark text-white ${sidebarOpen ? 'open' : ''}`}>
      <div className="p-3">
        <h5>Reception Dashboard</h5>
        <ul className="nav flex-column mt-4">
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/checkin"
            >
              <i className="fas fa-sign-in-alt me-2" title="Check-In"></i>
              CHECK-IN
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/checkout"
            >
              <i className="fas fa-sign-out-alt me-2" title="Check-Out"></i>
              CHECK-OUT
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/customers"
            >
              <i className="fas fa-users me-2" title="Customer Details"></i>
              CUSTOMER DETAILS
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/employees"
            >
              <i className="fas fa-user-tie me-2" title="Employee Details"></i>
              EMPLOYEE DETAILS
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/rooms"
            >
              <i className="fas fa-door-open me-2" title="Room Details"></i>
              ROOM DETAILS
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/drivers"
            >
              <i className="fas fa-id-badge me-2" title="Driver Details"></i>
              DRIVER DETAILS
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/cleaning"
            >
              <i className="fas fa-broom me-2" title="Room Cleaning"></i>
              ROOM CLEANING
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/login/dashboard/reception/pickup"
            >
              <i
                className="fas fa-shuttle-van me-2"
                title="Pick-up Service"
              ></i>
              PICK-UP SERVICE
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/login/dashboard">
              <i className="fas fa-user-cog me-2" title="Admin Panel"></i>
              ADMIN
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Rsidebar;
