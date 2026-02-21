import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../PageCSS/Universal.css';

function AddEmployee() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [job, setJob] = useState('');
  const [salary, setSalary] = useState('');

  const [jobOptions, setJobOptions] = useState(() => {
    const savedJobs = localStorage.getItem('jobOptions');
    return savedJobs
      ? JSON.parse(savedJobs)
      : ['Accountant', 'Receptionist', 'Chef'];
  });

  useEffect(() => {
    localStorage.setItem('jobOptions', JSON.stringify(jobOptions));
  }, [jobOptions]);

  const handleAddJob = () => {
    const newJob = prompt('Enter new job title:');
    if (newJob) {
      const trimmed = newJob.trim();
      if (trimmed && !jobOptions.includes(trimmed)) {
        setJobOptions([...jobOptions, trimmed]);
        alert('New job added!');
      } else {
        alert('Job already exists or is invalid.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeData = { name, age, gender, job, salary };
    try {
      const response = await axios.post(
        'http://localhost:3001/add-employee',
        employeeData
      );
      if (response.data.success) {
        alert('Employee added successfully!');
        handleReset();
      } else {
        alert('Failed to add employee.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error.');
    }
  };

  const handleReset = () => {
    setName('');
    setAge('');
    setGender('');
    setJob('');
    setSalary('');
  };

  return (
    <form className="main-banner-employee-banner" onSubmit={handleSubmit}>
      <h2 className="form-title">Add Employee</h2>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Age</label>
        <input
          type="number"
          min="18"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Gender</label>
        <div className="gender-options">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === 'Male'}
              onChange={() => setGender('Male')}
            />{' '}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === 'Female'}
              onChange={() => setGender('Female')}
            />{' '}
            Female
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Job</label>
        <div className="add-job-row">
          <select value={job} onChange={(e) => setJob(e.target.value)} required>
            <option value="">Select Job</option>
            {jobOptions.map((jobTitle, index) => (
              <option key={index} value={jobTitle}>
                {jobTitle}
              </option>
            ))}
          </select>
          <button type="button" className="add-job-btn" onClick={handleAddJob}>
            Add Job
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Salary</label>
        <input
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
        <button type="button" className="cancel-btn" onClick={handleReset}>
          CANCEL
        </button>
      </div>
    </form>
  );
}

export default AddEmployee;
