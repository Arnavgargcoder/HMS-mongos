import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../RecptionCSS/Rcontent.css';

function Rcontent() {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const uid = sessionStorage.getItem('uid'); // ✅ Use sessionStorage

  const Logout = () => {
    sessionStorage.removeItem('uid'); // ✅ Remove from sessionStorage
    navigate('/login');
  };

  useEffect(() => {
    if (!uid) {
      navigate('/login'); // ✅ Redirect if uid not found
      return;
    }

    axios
      .get(`http://localhost:3001/manager/${uid}`)
      .then((res) => {
        setManager(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading manager:', err);
        setLoading(false);
      });
  }, [uid, navigate]);

  if (!uid) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading your data...</p>;
  }

  return (
    <section className="main-banner-reception">
      <div className="banner-left">
        <img
          src={manager?.photo || '/default-avatar.png'}
          alt="Profile"
          className="banner-photo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-avatar.png';
          }}
        />
        <button className="logout-btn" onClick={Logout}>
          Logout
        </button>
      </div>

      <div className="banner-text">
        <h1>HOTEL ROYAL</h1>
        <p className="tagline">Hope for your best experience ....</p>
        <p className="role">UID : {manager.uid}</p>
        <h3>{manager.name}</h3>
        <p className="role">Hotel Manager</p>
      </div>
    </section>
  );
}

export default Rcontent;
