import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectInterests.css';

const interestsList = [
  'coding', 'music', 'film', 'editing', 'sports', 'gaming', 'writing', 'design', 'robotics', 'literature'
];

const SelectInterests = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const submitInterests = async () => {
    const participantId = localStorage.getItem('participantId');

    if (!participantId) {
      alert("User not found. Please sign up again.");
      navigate('/participant-signup');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${participantId}/interests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: selected }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update interests");
        return;
      }

      // ✅ Clean up and redirect to login
      localStorage.removeItem('participantId');
      alert("Interests saved successfully. Please log in.");
      navigate('/participant-login');
    } catch (err) {
      console.error('Interest update error:', err);
      alert('Network error. Try again.');
    }
  };

  return (
    <div className="select-interests-container">
      <h2>Select Your Interests</h2>
      <div className="interests-grid">
        {interestsList.map((interest) => (
          <button
            key={interest}
            className={`interest-btn ${selected.includes(interest) ? 'selected' : ''}`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
      <button className="submit-btn" onClick={submitInterests}>
        Continue
      </button>
    </div>
  );
};

export default SelectInterests;
