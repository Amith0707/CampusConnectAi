import React from 'react';
import NavBar from '../components/NavBar';
import FeatureCard from '../components/FeatureCard';
import './Home.css';

import { FaCalendarAlt, FaChartLine, FaUsers, FaRocket } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-container">
      <NavBar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">
            Welcome to{' '}
            <span className="neon-underline">CampusConnect</span>
          </h1>
          <p className="hero-subtitle">
            Your one-stop platform for event discovery, participation tracking, and personalized college experiences.
          </p>
          <button className="btn btn-primary">Explore Events</button>
        </div>

        {/* Floating abstract shapes */}
        <div className="floating-shapes">
          {/* You can add SVG blobs or colored divs */}
          <div className="blob purple"></div>
          <div className="blob blue"></div>
          <div className="blob green"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <FeatureCard
          icon={<FaCalendarAlt />}
          title="Discover Events"
          description="Find all the latest college events in one place."
        />
        <FeatureCard
          icon={<FaUsers />}
          title="Join Communities"
          description="Connect with like-minded students and groups."
        />
        <FeatureCard
          icon={<FaChartLine />}
          title="Track Participation"
          description="Monitor your event attendance and achievements."
        />
        <FeatureCard
          icon={<FaRocket />}
          title="Personalized Experience"
          description="Get recommendations tailored just for you."
        />
      </section>

      {/* Footer */}
      <footer className="footer">
        &copy; 2025 CampusConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
