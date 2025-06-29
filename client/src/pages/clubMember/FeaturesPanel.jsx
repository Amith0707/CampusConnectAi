import React, { useState, useEffect } from "react";
import "./FeaturesPanel.css";
import SentimentPopup from "../../components/SentimentPopup";

const branches = ["AIML", "CSE", "ISE", "ECE", "EEE", "ME", "DS", "MBA", "BBA",];
const interests = [
  "Tech", "Sports", "Music", "Art", "Coding", "Gaming",
  "Literature", "Photography", "Travel", "Science", "Cultural", "Fun", "Talks"
];

const FeaturesPanel = ({ onClose, clubName }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipation, setShowParticipation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [predictionForm, setPredictionForm] = useState({
    title: "",
    description: "",
    branches: [],
    interests: [],
  });

  useEffect(() => {
    fetchLatestEvents();
  }, []);

  const fetchLatestEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events/latest");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/sentiment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_name: selectedEvent.title })
      });

      const result = await res.json();
      setPopupData({
        event: result.event,
        stats: result.stats,
        filePath: result.filePath
      });
      setShowPopup(true);
    } catch (err) {
      console.error("Sentiment analysis failed:", err);
      alert("Sentiment analysis failed.");
    } finally {
      setLoading(false);
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

  const toggleRegistration = async (eventId, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/registration`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRegistrationOpen: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update registration");

      // Refresh event list after toggle
      fetchLatestEvents();
    } catch (err) {
      console.error("Toggle registration failed:", err);
      alert("Could not update registration status.");
    }
  };
  const handlePredict = async () => {
    const { branches, interests } = predictionForm;

    if (branches.length === 0 || interests.length === 0) {
      alert("Please select at least one branch and one interest.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/predict-participation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branches, interests }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`📈 Estimated participants: ${result.estimatedParticipants} out of ${result.totalSimulated}`);
      } else {
        alert("Prediction failed. Try again.");
        console.error(result);
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="features-panel">
      <div className="features-header">
        <h2> Features</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {/* Feedback Analysis */}
      <div className="feature-section">
        <h3> Feedback Analysis</h3>
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

      {/* Participation Prediction */}
      <div className="feature-section">
        <h3
          className="dropdown-header"
          onClick={() => setShowParticipation(!showParticipation)}
        >
           Predict Participation {showParticipation ? "▲" : "▼"}
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
              onClick={handlePredict}
            >
              Predict
            </button>
          </div>
        )}
      </div>

      {/* Manage Registrations */}
      <div className="feature-section">
        <h3>📥 Manage Registrations</h3>
        <p>Select to toggle registration availability:</p>
        {events.map((event) => (
          <label key={event._id} className="checkbox-option">
            <input
              type="checkbox"
              checked={event.isRegistrationOpen || false}
              onChange={() => toggleRegistration(event._id, event.isRegistrationOpen)}
            />
            {event.title} – {event.isRegistrationOpen ? "🟢 Open" : "🔴 Closed"}
          </label>
        ))}
      </div>

      {/* Popup */}
      {showPopup && popupData && (
        <SentimentPopup
          popupData={popupData}
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
