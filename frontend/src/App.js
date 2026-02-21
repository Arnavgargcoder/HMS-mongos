import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Dashborad/Home';
import Login from './AuthComponents/Login';
import Signup from './AuthComponents/Signup';
import DashboardLayout from './Components/Main/DashboardLayout';
import RdashboardLayout from './reception/Main/RdashboardLayout';
import AddEmployee from './Components/Pages/AddEmployee';
import AddRoom from './Components/Pages/AddRoom';
import AddDriver from './Components/Pages/AddDriver';
import Content from './Components/Pages/Content';
import ProtectedRoute from './AuthComponents/ProtectedRoute';
import Rcontent from './reception/pages/Rcontent';

// You can later add these as needed
import CheckIn from './reception/pages/CheckIn';
import CheckOut from './reception/pages/CheckOut';
import CustomerDetails from './reception/pages/CustomerDetails';
import EmployeeDetails from './reception/pages/EmployeeDetails';
import RoomDetails from './reception/pages/RoomDetails';
import DriverDetails from './reception/pages/DriverDetails';
import RoomCleaning from './reception/pages/RoomCleaning';
import PickupService from './reception/pages/PickupService';

function App() {
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('uid'); // Or use sessionStorage.removeItem('uid');
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard Routes (Protected) */}
        <Route
          path="/login/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Content />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="add-rooms" element={<AddRoom />} />
          <Route path="add-driver" element={<AddDriver />} />
        </Route>

        {/* Reception Dashboard Routes (Protected) */}
        <Route
          path="/login/dashboard/reception"
          element={
            <ProtectedRoute>
              <RdashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Rcontent />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="customers" element={<CustomerDetails />} />
          <Route path="employees" element={<EmployeeDetails />} />
          <Route path="rooms" element={<RoomDetails />} />
          <Route path="drivers" element={<DriverDetails />} />
          <Route path="cleaning" element={<RoomCleaning />} />
          <Route path="pickup" element={<PickupService />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
