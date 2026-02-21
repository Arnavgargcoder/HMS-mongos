import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../RecptionCSS/Details.css';
import { useNavigate } from 'react-router-dom';

function DriverDetails() {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/alldrivers`);
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  useEffect(() => {
    fetchDrivers(); // load once
    const interval = setInterval(fetchDrivers, 1000); // update every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="driver-details-container">
      <h1>Driver Details</h1>
      <table className="driver-table">
        <thead>
          <tr>
            <th>CUMID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Car Model</th>
            <th>Car Number</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td>{driver.cumid}</td>
              <td>{driver.name}</td>
              <td>{driver.age}</td>
              <td>{driver.gender}</td>
              <td>{driver.carmodel}</td>
              <td>{driver.carnumber}</td>
              <td>{driver.availability}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="back-button"
        onClick={() => navigate('/login/dashboard/reception')}
      >
        BACK
      </button>
    </div>
  );
}

export default DriverDetails;
