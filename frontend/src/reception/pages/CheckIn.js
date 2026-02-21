import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../RecptionCSS/checkin.css';

function CheckIn() {
  const [identityType, setIdentityType] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [bedType, setBedType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [roomOptions, setRoomOptions] = useState([]);

  // Update check-in time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCheckInTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch room numbers when bed type changes
  useEffect(() => {
    if (bedType) {
      axios
        .get(
          `http://localhost:3001/checkin-rooms/${encodeURIComponent(bedType)}`
        )
        .then((res) => {
          setRoomOptions(res.data);
          if (res.data.length > 0)
            setRoomNumber(res.data[0]); // auto-select first room
          else setRoomNumber('');
        })
        .catch((err) => console.error('Error fetching rooms:', err));
    } else {
      setRoomOptions([]);
      setRoomNumber('');
    }
  }, [bedType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        identityType,
        identityNumber,
        name,
        gender,
        checkInTime,
        bedType,
        roomNumber,
        amount,
      };

      const response = await axios.post(
        'http://localhost:3001/checkin-customer',
        payload
      );
      alert(response.data.message || 'Check-in successful');
      handleReset();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Check-in failed. Try again.');
    }
  };

  const handleReset = () => {
    setIdentityType('');
    setIdentityNumber('');
    setName('');
    setGender('');
    setBedType('');
    setRoomNumber('');
    setAmount('');
    setRoomOptions([]);
  };

  return (
    <form className="checkin-banner" onSubmit={handleSubmit}>
      <h2 className="checkin-title">CHECK IN</h2>
      <div className="checkin-row">
        <div className="checkin-group">
          <label>Identity Type</label>
          <select
            value={identityType}
            onChange={(e) => setIdentityType(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Aadhar Card">Aadhar Card</option>
            <option value="PAN Card">PAN Card</option>
            <option value="Passport">Passport</option>
          </select>
        </div>

        <div className="checkin-group">
          <label>Identity Number</label>
          <input
            type="text"
            value={identityNumber}
            onChange={(e) => setIdentityNumber(e.target.value)}
            required
          />
        </div>

        <div className="checkin-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="checkin-row">
        <div className="checkin-group">
          <label>Gender</label>
          <div className="checkin-gender-options">
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

        <div className="checkin-group">
          <label>Check-In Time</label>
          <input type="text" value={checkInTime} readOnly />
        </div>

        <div className="checkin-group">
          <label>Bed Type</label>
          <select
            value={bedType}
            onChange={(e) => setBedType(e.target.value)}
            required
          >
            <option value="">Select Bed Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Queen Bed">Queen Bed</option>
            <option value="King Bed">King Bed</option>
          </select>
        </div>
      </div>

      <div className="checkin-row">
        <div className="checkin-group">
          <label>Room Number</label>
          <select
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
            disabled={!roomOptions.length}
          >
            <option value="">Select Room</option>
            {roomOptions.map((room, idx) => (
              <option key={idx} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <div className="checkin-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="checkin-buttons">
        <button type="submit" className="checkin-submit">
          SUBMIT
        </button>
        <button type="button" className="checkin-cancel" onClick={handleReset}>
          CANCEL
        </button>
      </div>
    </form>
  );
}

export default CheckIn;
