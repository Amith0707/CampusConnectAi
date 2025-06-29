import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParticipantDashboard.css';

const ALL_INTERESTS = ['Tech', 'Sports', 'Music', 'Art', 'Coding', 'Gaming', 'Literature', 'Photography', 'Travel', 'Science'];

const ParticipantDashboard = () => {
  const [participantData, setParticipantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();
  const [receiptStatus, setReceiptStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const participantId = localStorage.getItem('participantId');
      if (!participantId) return navigate('/participant-login');

      try {
        const res = await fetch(`http://localhost:5000/api/auth/${participantId}`);
        const data = await res.json();
        if (res.ok) {
          setParticipantData(data);
          setInterests(data.interests || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/participant-login');
  };

  const toggleInterest = async (interest) => {
    const updated = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];

    setInterests(updated);
    try {
      await fetch(`http://localhost:5000/api/auth/${participantData._id}/interests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: updated }),
      });
      localStorage.setItem('participantInterests', JSON.stringify(updated));
    } catch (err) {
      console.error('Error updating interests:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="participant-dashboard">
      <nav className="navbar">
        <div className="logo">CampusConnect AI</div>
        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <button className="profile-btn" onClick={() => setShowProfile(true)} aria-label="Open Profile Panel">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="28" viewBox="0 0 24 24" width="28">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.6 0-10.8 1.8-10.8 5.4v2.4h21.6v-2.4c0-3.6-7.2-5.4-10.8-5.4z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="glass-container">
        <h1 className="welcome-msg">Welcome, {participantData.name} 👋</h1>

        {participantData?.recommendedEvents?.length > 0 ? (
          <section className="events-section">
            <h2>Recommended Events for You</h2>
            <div className="cards-grid">
              {participantData.recommendedEvents.map((event) => (
                <div key={event._id} className="event-feature-card">
                  <h4 className="event-club-name">{event.clubName}</h4>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <p className="event-meta">
                    📅 {event.date ? new Date(event.date).toLocaleDateString("en-IN") : "TBA"} &nbsp; | &nbsp;
                    ⏰ {event.time || "TBA"} &nbsp; | &nbsp;
                    📍 {event.venue || "TBA"}
                  </p>
                  <div className="event-tags">
                    {event.interests?.map((tag, i) => (
                      <span key={i} className="event-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="event-bottom">
                    <span className={`event-badge ${event.freeOrPaid === 'free' ? 'free' : 'paid'}`}>
                      {event.freeOrPaid==='paid'
                        ?`Paid-₹${event.entryFee}`
                        :'Free'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {/* <button className="register-btn">Register</button> */}
                      {event.googleFormLink ? (
                        <a
                          href={event.googleFormLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="register-btn"
                          style={{ textDecoration: "none" }}
                        >
                          Register
                        </a>
                        //got an edge case error where no google form was there
                      ) : (
                        <button className="register-btn" disabled>No Form</button>
                      )}
                      {event.freeOrPaid === 'paid' && (
                        <>
                          <input
                            type="file"
                            accept="application/pdf"
                            id={`receipt-${event._id}`}
                            style={{ display: 'none' }}
                            onChange={async(e) => {
                              const file = e.target.files[0];
                              // if (file) alert(`Selected receipt: ${file.name}`);
                              if (file) {
                                const formData = new FormData();
                                formData.append("eventId", event._id);
                                formData.append("receipt", file);

                                try {
                                  const res = await fetch("http://localhost:5000/api/verify-receipt", {
                                    method: "POST",
                                    body: formData,
                                  });

                                  const data = await res.json();

                                  setReceiptStatus((prev) => ({
                                    ...prev,
                                    [event._id]: data.status === "Verified" ? " Receipt Verified" : " Invalid Receipt",
                                  }));
                                } catch (err) {
                                  setReceiptStatus((prev) => ({
                                    ...prev,
                                    [event._id]: " Upload Failed",
                                  }));
                                }
                              }
                            }}
                          />
                          <button
                            className="register-btn"
                            style={{ background: '#ffa94d', color: '#0e1217' }}
                            onClick={() => document.getElementById(`receipt-${event._id}`).click()}
                          >
                            Upload Receipt
                          </button>
                          {receiptStatus[event._id] && (
                            <span style={{ color: event.freeOrPaid === 'paid' ? '#00ffab' : '#ff4d4d', fontWeight: 600 }}>
                              {receiptStatus[event._id]}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <p style={{ color: '#aaa' }}>No event recommendations yet.</p>
        )}
      </div>

      <div className={`profile-slideout ${showProfile ? 'open' : ''}`}>
        <button className="close-profile-btn" onClick={() => setShowProfile(false)}>×</button>
        <h2>Your Profile</h2>
        <p><strong>USN:</strong> {participantData.usn}</p>
        <p><strong>Email:</strong> {participantData.email}</p>

        <div className="interests-container">
          <strong>Edit Interests:</strong>
          <div className="interest-checkboxes">
            {ALL_INTERESTS.map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
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
