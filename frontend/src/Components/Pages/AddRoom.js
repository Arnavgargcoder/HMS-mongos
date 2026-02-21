// src/Components/Pages/AddRoom.js
import React, { useState } from 'react';
import '../PageCSS/Universal.css';

function AddRoom() {
  const [roomNumber, setRoomNumber] = useState('');
  const [bedType, setBedType] = useState('Single Bed');
  const [condition, setCondition] = useState('Clean');
  const [availability, setAvailability] = useState('Available');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      roomNumber: roomNumber.trim(),
      bedType,
      condition,
      availability,
      price: parseFloat(price), // 👈 Ensure price is number
    };

    try {
      const response = await fetch('http://localhost:3001/add-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });

      const data = await response.json();
      if (data.success) {
        alert('Room added successfully!');
        handleReset();
      } else {
        alert(`Failed to add room: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error.');
    }
  };

  const handleReset = () => {
    setRoomNumber('');
    setBedType('Single Bed');
    setCondition('Clean');
    setAvailability('Available');
    setPrice('');
  };

  return (
    <form className="main-banner-room-banner" onSubmit={handleSubmit}>
      <h2 className="form-title">Add Room</h2>

      <div className="form-group">
        <label>Room Number</label>
        <input
          type="text"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Bed Type</label>
        <select value={bedType} onChange={(e) => setBedType(e.target.value)}>
          <option>Single Bed</option>
          <option>Double Bed</option>
          <option>Queen Bed</option>
          <option>King Bed</option>
        </select>
      </div>

      <div className="form-group">
        <label>Room Condition</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option>Clean</option>
          <option>Dirty</option>
        </select>
      </div>

      <div className="form-group">
        <label>Availability</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option>Available</option>
          <option>Occupied</option>
        </select>
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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

export default AddRoom;
