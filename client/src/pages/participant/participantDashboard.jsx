// src/pages/ParticipantDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipantDashboard = () => {
  const [participantName, setParticipantName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipantData = async () => {
      const participantId = localStorage.getItem('participantId');
      if (!participantId) {
        navigate('/participant-login');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/auth/${participantId}`);
        const data = await res.json();

        if (res.ok) {
          setParticipantName(data.name || 'Participant');
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Error fetching participant data:', err);
      }
    };

    fetchParticipantData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/participant-login');
  };

  return (
    <div style={{
      backgroundColor: '#0e0e0e',
      color: 'white',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <h1>Welcome, {participantName} 👋</h1>
      <p>This is your dashboard. More features coming soon!</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '2rem',
          padding: '10px 20px',
          backgroundColor: '#00ffab',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default ParticipantDashboard;
