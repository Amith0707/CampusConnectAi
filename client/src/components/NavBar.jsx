import React from 'react';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">CampusConnect</div>
      <ul className="navbar-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#events">Events</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button className="btn btn-contact">Contact Us</button>
    </nav>
  );
};

export default NavBar;
