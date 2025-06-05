import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_INTERESTS = [
  'Tech', 'Sports', 'Music', 'Art', 'Coding', 'Gaming', 'Literature', 'Photography', 'Travel', 'Science',
];

const ParticipantDashboard = () => {
  const [participantData, setParticipantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [interests, setInterests] = useState([]);
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
          setParticipantData(data);
          setInterests(data.interests || []);
          setLoading(false);
        } else {
          console.error(data.message);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching participant data:', err);
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/participant-login');
  };

  const toggleInterest = (interest) => {
    let updatedInterests = [];
    if (interests.includes(interest)) {
      updatedInterests = interests.filter((i) => i !== interest);
    } else {
      updatedInterests = [...interests, interest];
    }
    setInterests(updatedInterests);
    updateInterestsBackend(updatedInterests);
  };

  const updateInterestsBackend = async (updatedInterests) => {
    if (!participantData?._id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${participantData._id}/interests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: updatedInterests }),
      });

      if (res.ok) {
        localStorage.setItem('participantInterests', JSON.stringify(updatedInterests));
      } else {
        console.error('Failed to update interests');
      }
    } catch (err) {
      console.error('Error updating interests:', err);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;

  return (
    <div
      style={{
        backgroundColor: '#0e0e0e',
        color: 'white',
        minHeight: '100vh',
        width: '100vw',      // Full width
        height: '100vh',     // Full height
        fontFamily: 'sans-serif',
        overflowX: 'hidden', // Hide horizontal scroll
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: '#121212',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          borderBottom: '1px solid #222',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#00ffab' }}>
          CampusConnect AI
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#00ffab',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>

          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: 0,
            }}
            aria-label="Toggle Profile Panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              height="32"
              viewBox="0 0 24 24"
              width="32"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.6 0-10.8 1.8-10.8 5.4v2.4h21.6v-2.4c0-3.6-7.2-5.4-10.8-5.4z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
        <h1>Welcome, {participantData.name || 'Participant'} 👋</h1>
        <p>This is your dashboard. More features coming soon!</p>
      </div>

      {/* Sliding Profile Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: '#1e1e1e',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.7)',
          padding: '2rem',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 150,
          color: 'white',
          overflowY: 'auto',
          transform: showProfile ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Your Profile</h2>
        <button
          onClick={() => setShowProfile(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          aria-label="Close Profile Panel"
        >
          ×
        </button>

        <div style={{ marginBottom: '1rem' }}>
          <strong>USN:</strong> {participantData.usn || 'N/A'}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Email:</strong> {participantData.email || 'N/A'}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Interests:</strong>
          <div style={{ marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
            {ALL_INTERESTS.map((interest) => (
              <label
                key={interest}
                style={{
                  display: 'block',
                  cursor: 'pointer',
                  marginBottom: '0.3rem',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  style={{ marginRight: '0.5rem' }}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
/*This dashboard is perfect */