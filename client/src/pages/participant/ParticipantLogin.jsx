import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParticipantAuth.css';

const ParticipantLogin = () => {
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    console.log('[Login] Form submit triggered');
    console.log('[Login] Current email:', email);
    console.log('[Login] USN:', usn);
    console.log('[Login] Current password:', password ? '******' : '(empty)');

    if (!email|| !usn || !password) {
      console.warn('[Login] Missing email or password');
      alert('Please enter  email,USN and password');
      return;
    }

    console.log('[Login] Navigating to /loading with loginData state...');
    navigate('/loading', {
      state: { loginData: { email,usn, password } },
    });
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
              onChange={(e) => {
                setEmail(e.target.value);
                console.log('[Login] Email input changed:', e.target.value);
              }}
              required
            />
          </div>

          <div className="auth-group">
            <label>USN</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter USN"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
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
              onChange={(e) => {
                setPassword(e.target.value);
                console.log('[Login] Password input changed: ******');
              }}
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Login
          </button>
          <p className="auth-link">
            Don’t have an account?{' '}
            <span
              onClick={() => {
                console.log('[Login] Navigating to signup page');
                navigate('/participant-signup');
              }}
              style={{ cursor: 'pointer', color: '#00ffab', textDecoration: 'underline' }}
            >
              Sign up here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ParticipantLogin;

