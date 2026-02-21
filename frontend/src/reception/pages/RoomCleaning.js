import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../RecptionCSS/cleaning.css';

function RoomCleaning() {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [condition, setCondition] = useState('');
  const [roomOptions, setRoomOptions] = useState([]);

  // Fetch all dirty + occupied rooms with full details
  useEffect(() => {
    axios
      .get('http://localhost:3001/dirty-room')
      .then((res) => {
        setRoomOptions(res.data);
      })
      .catch((err) => console.error('Error fetching rooms:', err));
  }, []);

  // When user selects a room, fill all fields from roomOptions
  useEffect(() => {
    if (roomNumber) {
      const selectedRoom = roomOptions.find(
        (room) => room.roomnumber === roomNumber
      );
      if (selectedRoom) {
        setRoomPrice(selectedRoom.price || '');
        setAvailability(selectedRoom.availability || '');
        setCondition(selectedRoom.roomcondition || '');
      }
    } else {
      setRoomPrice('');
      setAvailability('');
      setCondition('');
    }
  }, [roomNumber, roomOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        roomNumber,
        availability,
        condition,
      };

      const response = await axios.post(
        'http://localhost:3001/room-cleaning',
        payload
      );
      alert(response.data.message || 'Room updated successfully');

      // Refresh dropdown list after update
      const updated = await axios.get('http://localhost:3001/dirty-room');
      setRoomOptions(updated.data);

      handleReset();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Room update failed. Try again.');
    }
  };

  const handleReset = () => {
    setRoomNumber('');
    setRoomPrice('');
    setAvailability('');
    setCondition('');
  };

  return (
    <form className="cleaning-banner" onSubmit={handleSubmit}>
      <h2 className="cleaning-title">Room Cleaning</h2>

      <div className="cleaning-group">
        <label>Room Number</label>
        <select
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        >
          <option value="">Select Room</option>
          {roomOptions.map((room, idx) => (
            <option key={idx} value={room.roomnumber}>
              {room.roomnumber}
            </option>
          ))}
        </select>
      </div>

      <div className="cleaning-group">
        <label>Room Price</label>
        <input type="text" value={roomPrice} readOnly />
      </div>

      <div className="cleaning-group">
        <label>Availability</label>
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

      <div className="cleaning-group">
        <label>Update Condition</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          required
        >
          <option value="">Select Condition</option>
          <option value="Clean">Clean</option>
          <option value="Dirty">Dirty</option>
        </select>
      </div>

      <div className="cleaning-buttons">
        <button type="submit" className="cleaning-submit">
          SUBMIT
        </button>
        <button type="button" className="cleaning-cancel" onClick={handleReset}>
          CANCEL
        </button>
      </div>
    </form>
  );
}

export default RoomCleaning;
