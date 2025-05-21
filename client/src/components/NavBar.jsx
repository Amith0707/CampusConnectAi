import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">CampusConnect</div>

        <div className="navbar-center">
          <ul className="navbar-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="navbar-buttons">
          <button className="btn btn-contact">Contact Us</button>
          <button className="btn btn-login">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
