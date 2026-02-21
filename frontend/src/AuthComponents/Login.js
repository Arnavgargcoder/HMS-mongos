import React, { useState } from 'react';
import './utils/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [uid, setUid] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!uid || !pwd) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        uid,
        pwd,
      });

      if (response.status === 200) {
        alert('Login successful');

        // ✅ Use sessionStorage for auto-logout on close/refresh
        sessionStorage.setItem('uid', response.data.user.uid);

        navigate('/login/dashboard');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError('Invalid UID or password');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/images/logo.jpg" alt="Logo" className="logo-img" />
      </div>
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <div className="button-group">
            <button type="submit">WELCOME</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
