import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './utils/SignPage.css';

const generateUID = () => 'UID' + Math.floor(100000 + Math.random() * 900000);

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uid: generateUID(),
    name: '',
    gender: '',
    photo: null,
    pwd: '',
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo') {
      const file = files?.[0];
      if (file && file.type.startsWith('image/')) {
        setFormData({ ...formData, photo: file });
        setPhotoPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, photo: null }));
      } else {
        setErrors((prev) => ({
          ...prev,
          photo: 'Only image files are allowed',
        }));
        setPhotoPreview(null);
        setFormData({ ...formData, photo: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleReset = () => {
    setFormData({
      uid: generateUID(),
      name: '',
      gender: '',
      photo: null,
      pwd: '',
    });
    setErrors({});
    setPhotoPreview(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.gender) newErrors.gender = 'Select gender';
    if (!formData.pwd) newErrors.pwd = 'Password is required';
    if (!formData.photo) newErrors.photo = 'Photo is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();
      data.append('uid', formData.uid);
      data.append('name', formData.name);
      data.append('gender', formData.gender);
      data.append('pwd', formData.pwd);
      data.append('photo', formData.photo);

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, data);
      alert(res.data.message);
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Signup failed. Try again.';
      alert(message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-logo-container">
        <img src="/images/logo.jpg" alt="Logo" className="signup-logo-img" />
      </div>

      <div className="signup-form-wrapper">
        <form className="signup-form-box" onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center' }}>Sign Up</h2>

          <div className="signup-form-group">
            <label>UID</label>
            <input type="text" value={formData.uid} disabled />
          </div>

          <div className="signup-form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="signup-invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="signup-form-group">
            <label>Gender</label>
            <div className="signup-radio-group">
              <label className="signup-radio-inline">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  checked={formData.gender === 'Male'}
                />
                Male
              </label>
              <label className="signup-radio-inline">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  checked={formData.gender === 'Female'}
                />
                Female
              </label>
            </div>
            {errors.gender && (
              <div className="signup-invalid-feedback">{errors.gender}</div>
            )}
          </div>

          <div className="signup-form-group">
            <label>Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
            {errors.photo && (
              <div className="signup-invalid-feedback">{errors.photo}</div>
            )}
          </div>

          <div className="signup-form-group">
            <label>Password</label>
            <input
              type="password"
              name="pwd"
              value={formData.pwd}
              onChange={handleChange}
            />
            {errors.pwd && (
              <div className="signup-invalid-feedback">{errors.pwd}</div>
            )}
          </div>

          <div className="signup-button-group">
            <button type="submit" className="signup-submit-btn">
              Sign Up
            </button>
            <button
              type="button"
              className="signup-reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className="signup-cancel-btn"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>

        {photoPreview && (
          <div className="signup-photo-preview">
            <img
              src={photoPreview}
              alt="Preview"
              className="signup-photo-img"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
