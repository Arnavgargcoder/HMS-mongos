// src/Components/Pages/RoomDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../RecptionCSS/Details.css';
import { useNavigate } from 'react-router-dom';

function RoomDetails() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  // Function to fetch data
  const fetchRooms = () => {
    axios
      .get('http://localhost:3001/api/allrooms')
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Error fetching room details:', err));
  };

  useEffect(() => {
    fetchRooms(); // Initial fetch
    const intervalId = setInterval(fetchRooms, 1000); // Refresh every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="room-container">
      <h1>Room Details</h1>
      <table className="room-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Bed Type</th>
            <th>Condition</th>
            <th>Availability</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.roomnumber}>
                <td>{room.roomnumber}</td>
                <td>{room.bedtype}</td>
                <td>{room.roomcondition}</td>
                <td>{room.availability}</td>
                <td>{room.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No data available
              </td>
            </tr>
          )}
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

export default RoomDetails;
