// src/AuthComponents/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const uid = sessionStorage.getItem('uid'); // ✅ Use sessionStorage

  return uid ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
