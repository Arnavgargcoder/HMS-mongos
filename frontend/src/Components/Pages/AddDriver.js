// src/Components/Pages/AddDriver.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../PageCSS/Universal.css';

function AddDriver() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [availability, setAvailability] = useState('');

  const [carModelOptions, setCarModelOptions] = useState(() => {
    const saved = localStorage.getItem('carModelOptions');
    return saved ? JSON.parse(saved) : ['Swift', 'Baleno', 'Innova'];
  });

  useEffect(() => {
    localStorage.setItem('carModelOptions', JSON.stringify(carModelOptions));
  }, [carModelOptions]);

  const handleAddCarModel = () => {
    const newModel = prompt('Enter new car model:');
    if (newModel) {
      const trimmed = newModel.trim();
      if (trimmed && !carModelOptions.includes(trimmed)) {
        setCarModelOptions([...carModelOptions, trimmed]);
        alert('New model added and saved!');
      } else {
        alert('Model already exists or is invalid.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const driverData = {
      name: name.trim(),
      age: age.trim(),
      gender,
      carModel,
      carNumber: carNumber.trim(),
      availability: availability.trim(),
      cumid: null,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-driver`,
        driverData
      );
      if (res.data?.message === 'Driver added successfully') {
        alert('✅ Driver added successfully!');
        handleReset();
      } else {
        alert('❌ Failed to add driver');
      }
    } catch (err) {
      console.error('❌ Error submitting driver:', err);
      alert('❌ Server error while adding driver');
    }
  };

  const handleReset = () => {
    setName('');
    setAge('');
    setGender('');
    setCarModel('');
    setCarNumber('');
    setAvailability('');
  };

  return (
    <form className="main-banner-driver-banner" onSubmit={handleSubmit}>
      <h2 className="form-title full-width">Add New Driver</h2>

      <div className="form-group">
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          min="18"
        />
      </div>

      <div className="form-group">
        <label>Gender:</label>
        <div className="gender-options">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === 'Male'}
              onChange={() => setGender('Male')}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === 'Female'}
              onChange={() => setGender('Female')}
            />
            Female
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Car Model:</label>
        <div className="add-car-row">
          <select
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            required
          >
            <option value="">Select Car Model</option>
            {carModelOptions.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="add-car-btn"
            onClick={handleAddCarModel}
          >
            Add Model
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Car Number:</label>
        <input
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Availability:</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          Submit
        </button>
        <button type="button" className="cancel-btn" onClick={handleReset}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddDriver;
