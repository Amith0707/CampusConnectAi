// src/pages/clubMember/ClubDashboard.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const ClubDashboard = () => {
  const { clubName } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to the {clubName} Club Dashboard</h1>
      <p>This is a placeholder page. Dashboard UI will come here soon.</p>
    </div>
  );
};

export default ClubDashboard;
