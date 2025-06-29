import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen'; //  Use loading animation directly
import './ParticipantAuth.css';

const interestsList = [
  "Tech","Sports","Music","Art","Coding","Gaming","Literature","Photography","Travel","Science","Cultural","Fun","Talks",
];

const ParticipantSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    usn:'',
    email: '',
    password: '',
    department: '',
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); //  New loading state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedInterests.length < 2) {
      setError('Please select at least 2 interests');
      return;
    }

    try {
      setIsLoading(true); //  Start loading

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, interests: selectedInterests }),
      });

      const data = await res.json();

      if (res.ok && data._id) {
        localStorage.setItem('participantId', data._id);
        setTimeout(() => {
          navigate('/participant-dashboard');
        }, 1500); // Just to let loading screen show briefly
      } else {
        setError(data.message || 'Signup failed');
        setIsLoading(false); // Stop loading on failure
      }
    } catch (err) {
      console.error('Error during signup:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false); //  Stop loading on failure
    }
  };

  //  Loading animation render
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Participant Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {['name','usn', 'email', 'password', 'department'].map((field) => (
            <div className="auth-group" key={field}>
              <label>{field[0].toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                className="auth-input"
                placeholder={`Enter ${field}`}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="auth-group" ref={dropdownRef}>
            <label>Interests (pick at least 2)</label>
            <div
              className="dropdown-input"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setDropdownOpen(!dropdownOpen);
              }}
            >
              {selectedInterests.length > 0
                ? selectedInterests.join(', ')
                : 'Select interests'}
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {interestsList.map((interest) => (
                  <label key={interest} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedInterests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit">Continue</button>
        </form>

        <p className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/participant-login')}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default ParticipantSignup;
