import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ClubLogin.css'; // Import CSS file

const ClubLogin = () => {
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/club/login', {
        usn,
        password,
      });

      console.log('Login response:', response.data);//For tracking
      const { token, clubMember } = response.data;
      const clubName=clubMember.clubName;
      localStorage.setItem('clubToken', token);
      localStorage.setItem('clubName', clubName);

      navigate(`/club-dashboard/${clubName}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="club-login-container">
      <h2 className="club-login-heading">Club Member Login</h2>
      <form onSubmit={handleLogin} className="club-login-form">
        <input
          type="text"
          placeholder="Enter your USN"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
          required
          className="club-login-input"
        />
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="club-login-input"
        />
        {error && <p className="club-login-error">{error}</p>}
        <button type="submit" className="club-login-button">Login</button>
      </form>
    </div>
  );
};

export default ClubLogin;
