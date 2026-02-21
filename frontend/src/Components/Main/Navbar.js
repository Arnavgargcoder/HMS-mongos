import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Navbar({ toggleSidebar }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      {/* Sidebar toggle button */}
      <button
        className="btn text-white"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Logo / Title */}
      <h5 className="text-white mb-0 ms-3">HOTEL ROYAL</h5>

      {/* User icon link */}
      <div className="ms-auto d-flex align-items-center">
        <img src="/images/logo.jpg" alt="Logo" className="logo-img-nav" />
        <Link
          to="/login/dashboard"
          className="btn text-white"
          title="User Profile"
          aria-label="User Profile"
        >
          <i className="fas fa-user-circle fa-lg"></i>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
