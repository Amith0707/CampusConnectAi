import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParticipantAuth.css';

const ParticipantSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, interests: [] }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Signup successful! Please login.');
      navigate('/participant-login');
    } else {
      alert(data.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Participant Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="auth-input"
              placeholder="Enter full name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              className="auth-input"
              placeholder="Enter department"
              onChange={handleChange}
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Sign Up
          </button>
          <p className="auth-link">
            Already have an account? <span onClick={() => navigate('/participant-login')}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ParticipantSignup;
