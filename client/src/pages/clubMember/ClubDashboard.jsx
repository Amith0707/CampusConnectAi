import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClubDashboard.css";
import "./FeaturesPanel.css";

import tedxLogo from "../../assets/ted x white.png";
import litClubLogo from "../../assets/Lit Club.jpg";
import mediaClubLogo from "../../assets/Media Club.jpg";
import defaultLogo from "../../assets/default-logo.jpg";

import PostMedia from "./PostMedia";
import FeaturesPanel from "./FeaturesPanel"; // import FeaturesPanel

const clubData = {
  tedx: {
    displayName: "TEDx Club",
    logoUrl: tedxLogo,
  },
  lit_club: {
    displayName: "Lit Club",
    logoUrl: litClubLogo,
  },
  media_club: {
    displayName: "Media Club",
    logoUrl: mediaClubLogo,
  },
};

const interestOptions = [
  "Tech",
  "Sports",
  "Music",
  "Art",
  "Coding",
  "Gaming",
  "Literature",
  "Photography",
  "Travel",
  "Science",
  "Cultural",
  "Fun",
  "Talks",
];

export default function ClubDashboard() {
  const { clubName } = useParams();
  const navigate = useNavigate();
  const normalizedClubName = clubName.toLowerCase();
  const club = clubData[normalizedClubName] || {
    displayName: "Unknown Club",
    logoUrl: defaultLogo,
  };

  const [announcement, setAnnouncement] = useState("");
  const [title, setTitle] = useState("");
  const token = localStorage.getItem("clubToken");

  // Event Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  // const [stateVariable, setStateVariable] = useState(initialValue);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventInterests, setEventInterests] = useState([]); // changed to array
  const [eventType, setEventType] = useState("free");
  const [eventPosting, setEventPosting] = useState(false);
  const [googleFormLink, setGoogleFormLink] = useState("");//added 
  const [googleSheetLink, setGoogleSheetLink] = useState("");//added new

  const [entryFee, setEntryFee] = useState("");//added this entry fee 
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');

  // New state to control FeaturesPanel visibility
  const [showFeaturesPanel, setShowFeaturesPanel] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/club-login");
    }
  }, [navigate, token]);

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !announcement.trim()) {
      alert("Title and announcement content cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/club-content/announcement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content: announcement,
            clubName: normalizedClubName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post announcement");
      }

      alert("Announcement submitted successfully!");
      //resetting
      setAnnouncement("");
      setTitle("");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const openEventModal = () => {
    setShowEventModal(true);//opens up the registrations
  };

  const closeEventModal = () => {
    //close the registration and sets the value to intial variable
    if (!eventPosting) {
      setShowEventModal(false);
      setEventTitle("");
      setEventDesc("");
      setEventInterests([]);
      setEventType("free");
      setEntryFee("");//added
      setGoogleFormLink("");//added google form link
      setEventDate('');
      setEventTime('');
      setEventVenue('');
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (!eventTitle.trim() || !eventDesc.trim() || eventInterests.length === 0) {
      alert("Please fill in all event fields and select at least one interest.");
      return;
    }

    setEventPosting(true);

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clubName: normalizedClubName,
          title: eventTitle,
          description: eventDesc,
          interests: eventInterests,
          freeOrPaid: eventType,
          postedAt: new Date().toISOString(),
          entryFee:eventType==="paid"? entryFee:0,
          googleFormLink,
          googleSheetLink,
          date: eventDate,
          time: eventTime,
          venue: eventVenue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      alert("Event created successfully!");
      closeEventModal();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setEventPosting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img
          src={club.logoUrl}
          alt={`${club.displayName} Logo`}
          className="club-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultLogo;
          }}
        />
        <div className="dashboard-header-content">
          <h1>Welcome to the {club.displayName} Dashboard</h1>
          <div className="header-buttons">
            {/* Changed Events button to Features button */}
            <button
              onClick={() => setShowFeaturesPanel(true)}
              className="features-button"
            >
              ⚙️ Features
            </button>
            <button onClick={openEventModal} className="create-event-button">
              + Create Event
            </button>
          </div>
        </div>
      </header>

      {/* Announcement Section */}
      <section className="dashboard-section">
        <h2>📢 Post an Announcement</h2>
        <form onSubmit={handleAnnouncementSubmit} className="form-container">
          <input
            type="text"
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-area"
          />
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Write your announcement here..."
            rows={4}
            className="input-area"
          />
          <button type="submit" className="neon-button">
            Submit
          </button>
        </form>
      </section>

      {/* Media Section */}
      <section className="dashboard-section">
        <h2>🎥 Post Media to Feed</h2>
        <PostMedia token={token} clubName={normalizedClubName} />
      </section>

      {/* ML Features Section */}
      <section className="dashboard-section">
        <h2>🤖 ML Features (Coming Soon)</h2>
        <div className="ml-feature-grid">
          <div className="ml-card">
            <h3>Participation Prediction</h3>
            <p>Predict expected participation in upcoming events.</p>
          </div>
          <div className="ml-card">
            <h3>Sentiment Analysis</h3>
            <p>Analyze sentiment from feedback and reviews.</p>
          </div>
          <div className="ml-card">
            <h3>OCR Receipt Verification</h3>
            <p>Verify participation receipts using OCR technology.</p>
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={closeEventModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Event</h2>
            <form onSubmit={handleEventSubmit} className="form-container">
              <input
                type="text"
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="input-area"
              />
              <textarea
                placeholder="Description"
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                rows={4}
                className="input-area"
              />
              {/*Adding venue date and time*/}
              <input
                type="date"
                placeholder="Event Date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="input-area"
              />
              <input
                type="time"
                placeholder="Event Time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="input-area"
              />
              <input
                type="text"
                placeholder="Event Venue"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                className="input-area"
              />              
              
              {/* Multi-select dropdown for interests */}
              <label htmlFor="event-interests" className="select-label">
                Select Interests (hold Ctrl or Cmd to select multiple)
              </label>
              <select
                id="event-interests"
                multiple
                value={eventInterests}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  const values = options.map((opt) => opt.value);
                  setEventInterests(values);
                }}
                className="input-area"
              >
                {interestOptions.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>

              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="input-area"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>

              {eventType === "paid" && (
                <input
                  type="number"
                  placeholder="Entry Fee"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  className="input-area"
                />
              )}

              <input
                type="url"
                placeholder="Google Form Link"
                value={googleFormLink}
                onChange={(e) => setGoogleFormLink(e.target.value)}
                className="input-area"
              />

              {/* Reminder and Copy Button */}
              <p style={{ fontSize: "12px", marginTop: "4px", color: "#ccc" }}>
                After creating the form, open the linked Google Sheet and share it with:
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "8px" }}>
                <code style={{ fontSize: "13px" }}>
                  campus-connect-sheet-bot@campusconnect-sheets.iam.gserviceaccount.com
                </code>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText("campus-connect-sheet-bot@campusconnect-sheets.iam.gserviceaccount.com")
                  }
                  className="neon-button"
                  style={{ padding: "4px 8px", fontSize: "12px" }}
                >
                  Copy
                </button>
              </div>

              {/* Google Sheet Link Input */}
              <p style={{ fontSize: "12px", marginTop: "-4px", color: "#ccc" }}>
                Paste the Google Sheet link (linked to your form)
              </p>
              <input
                type="url"
                placeholder="Google Sheet Link"
                value={googleSheetLink}
                onChange={(e) => setGoogleSheetLink(e.target.value)}
                className="input-area"
              />

              <div className="modal-buttons">
                <button
                  type="submit"
                  className="neon-button"
                  disabled={eventPosting}
                >
                  {eventPosting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={closeEventModal}
                  className="modal-close-button"
                  disabled={eventPosting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Features Panel Slide-in */}
      {showFeaturesPanel && (
        <FeaturesPanel
          clubName={normalizedClubName}
          onClose={() => setShowFeaturesPanel(false)}
        />
      )}
    </div>
  );
}
