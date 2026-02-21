import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../RecptionCSS/Details.css'; // Reuse or update as needed
import { useNavigate } from 'react-router-dom';

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/api/allemployees'
      );
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    const interval = setInterval(fetchEmployees, 1000); // Refresh every 1 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="employee-details-container">
      <h1>Employee Details</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Job</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.age}</td>
              <td>{emp.gender}</td>
              <td>{emp.job}</td>
              <td>{emp.salary}</td>
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

export default EmployeeDetails;
