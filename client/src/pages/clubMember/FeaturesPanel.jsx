import React, { useState, useEffect } from "react";
import "./FeaturesPanel.css";
import SentimentPopup from "../../components/SentimentPopup";


const branches = ["CSE", "AIML", "ECE", "EE", "ISE", "ME", "BCA", "MBA"];
const interests = [
  "Tech", "Sports", "Music", "Art", "Coding", "Gaming",
  "Literature", "Photography", "Travel", "Science", "Cultural", "Fun", "Talks"
];

const FeaturesPanel = ({ onClose, clubName }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipation, setShowParticipation] = useState(false);

  // State to manage sentiment popup visibility and data
  const [showPopup, setShowPopup] = useState(false); // Added: manage visibility of popup
  const [popupData, setPopupData] = useState(null); // Added: data to be passed to SentimentPopup
  const [loading, setLoading] = useState(false); // Added: button loading state

  const [predictionForm, setPredictionForm] = useState({
    title: "",
    description: "",
    branches: [],
    interests: [],
  });

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/latest");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchLatestEvents();
  }, []);

  // Function to trigger backend sentiment analysis and show popup
  const handleGenerate = async () => {
    if (!selectedEvent) return;

    setLoading(true); // Start loading
    try {
      const res = await fetch(`http://localhost:5000/api/sentiment/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ event_name: selectedEvent.title }) // Backend uses Excel file
      });

      const result = await res.json();
      setPopupData({
        event: result.event,
        stats: result.stats,
        filePath: result.filePath
      });
      setShowPopup(true); // Show popup on success
    } catch (err) {
      console.error("Failed to analyze sentiment:", err);
      alert("Sentiment analysis failed.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleBranchChange = (branch) => {
    setPredictionForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch],
    }));
  };

  const handleInterestChange = (interest) => {
    setPredictionForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="features-panel">
      <div className="features-header">
        <h2>⚙️ Features</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {/* Feedback Analysis Section */}
      <div className="feature-section">
        <h3>📊 Feedback Analysis</h3>
        {events.map((event) => (
          <label key={event._id} className="radio-option">
            <input
              type="radio"
              name="event"
              value={event._id}
              checked={selectedEvent?._id === event._id}
              onChange={() => setSelectedEvent(event)}
            />
            {event.title}
          </label>
        ))}
        {selectedEvent && (
          <button className="neon-button" onClick={handleGenerate}>
            {loading ? "Generating..." : "Generate"}
          </button>
        )}
      </div>

      {/* Participation Prediction Section */}
      <div className="feature-section">
        <h3
          className="dropdown-header"
          onClick={() => setShowParticipation(!showParticipation)}
        >
          📈 Predict Participation {showParticipation ? "▲" : "▼"}
        </h3>
        {showParticipation && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Event Title"
              value={predictionForm.title}
              onChange={(e) =>
                setPredictionForm({ ...predictionForm, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={predictionForm.description}
              onChange={(e) =>
                setPredictionForm({ ...predictionForm, description: e.target.value })
              }
            />

            <div className="checkbox-group">
              <strong>Targeted Branches:</strong>
              {branches.map((branch) => (
                <label key={branch}>
                  <input
                    type="checkbox"
                    value={branch}
                    checked={predictionForm.branches.includes(branch)}
                    onChange={() => handleBranchChange(branch)}
                  />
                  {branch}
                </label>
              ))}
            </div>

            <div className="checkbox-group">
              <strong>Interests:</strong>
              {interests.map((interest) => (
                <label key={interest}>
                  <input
                    type="checkbox"
                    value={interest}
                    checked={predictionForm.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>

            <button
              className="neon-button"
              onClick={() => alert("Prediction feature coming soon!")}
            >
              Predict
            </button>
          </div>
        )}
      </div>

      {/* Conditionally render SentimentPopup */}
      {showPopup && popupData && (
        <SentimentPopup
          popupData={popupData}   //this was causing render loading issue this small thing :
          onClose={() => {
            setShowPopup(false);
            setPopupData(null);
          }}
        />
      )}
    </div>
  );
};

export default FeaturesPanel;
