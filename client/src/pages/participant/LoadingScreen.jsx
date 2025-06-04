// LoadingScreen.jsx
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-card">
      <div className="loader">
        <p>loading</p>
        <div className="words">
          <span className="word">fun</span>
          <span className="word">events</span>
          <span className="word">reels</span>
          <span className="word">announcements</span>
          <span className="word">connections</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
