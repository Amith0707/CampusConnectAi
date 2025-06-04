import React from 'react';
import './Navbar.css';
import { Link } from "react-router-dom";

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
          {/* <button className="btn btn-contact">Contact Us</button> */}
          {/* Club Login as Link */}
          <Link to="/participant-signup" className="btn btn-signup">
            Signup
          </Link>
          {/* <button className="btn btn-login">Login</button> */}
          <Link to="/participant-login" className='btn btn-login'>
          Login
          </Link>

          {/* Club Login as Link */}
          <Link to="/club-login" className="btn btn-club-login">
            Club Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
