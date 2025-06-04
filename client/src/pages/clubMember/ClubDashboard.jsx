import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClubDashboard.css";

import tedxLogo from "../../assets/ted x white.png";
import litClubLogo from "../../assets/Lit Club.jpg";
import mediaClubLogo from "../../assets/Media Club.jpg";
import defaultLogo from "../../assets/default-logo.jpg";

import PostMedia from "./PostMedia";

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
      const response = await fetch("http://localhost:5000/api/club-content/announcement", {
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post announcement");
      }

      alert("Announcement submitted successfully!");
      setAnnouncement("");
      setTitle("");
    } catch (error) {
      alert(`Error: ${error.message}`);
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
          <button
            onClick={() => alert("📅 Events feature coming soon!")}
            className="events-button"
          >
            📅 Events
          </button>
        </div>
      </header>

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

      <section className="dashboard-section">
        <h2>🎥 Post Media to Feed</h2>
        <PostMedia token={token} clubName={normalizedClubName} />
      </section>

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
    </div>
  );
}
