import React from 'react';
import classes from '../styles/Button.module.css'; // Keep button styling as a module
import '../styles/Navbar.css'; // Import the new Navbar styles

function Navbar() {
  return (
    <div className="header-container">
      <img src="/Movie_App_Logo.png" alt="Movie App Logo" className="logo" />
      <input type="text" placeholder="Search Movie" />
      <div className="button-container">
        <button className={classes.button}>Sign in</button>
        <button className={classes.button}>Sign up</button>
      </div>
    </div>
  );
}

export default Navbar;
