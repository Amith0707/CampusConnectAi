import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ParticipantAuth.css';

const ParticipantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('userId', res.data.userId);

        navigate('/loading');  // <-- Navigate to loading page here
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Participant Login</h2>
        <form onSubmit={handleLogin}>
          <div className="auth-group">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Login
          </button>
          <p className="auth-link">
            Don’t have an account?{' '}
            <span onClick={() => navigate('/participant-signup')}>Sign up here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ParticipantLogin;
