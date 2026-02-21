import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../RecptionCSS/Details.css'; // Same CSS file
import { useNavigate } from 'react-router-dom';

function CustomerDetails() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/allcustomers`
      );
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="customer-details-container">
      <h1>Customer Details</h1>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Identity Type</th>
            <th>Identity No.</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Check-in Time</th>
            <th>Bed Type</th>
            <th>Room No.</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.identityType}</td>
              <td>{customer.identityNumber}</td>
              <td>{customer.name}</td>
              <td>{customer.gender}</td>
              <td>{customer.checkInTime}</td>
              <td>{customer.bedtype}</td>
              <td>{customer.roomnumber}</td>
              <td>{customer.amount}</td>
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

export default CustomerDetails;
