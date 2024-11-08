import React from 'react';
import classes from '../Css/Button.module.css'; // Keep button styling as a module
import '../Css/Navbar.css'; // Import the new Navbar styles
import logo from '../components/Movie_App_Logo.png'; // Import the logo image

function Navbar() {
  return (
    <div className="header-container">
      <img src={logo} alt="Movie App Logo" className="logo" />
      <input type="text" placeholder="Search Movie" />
      <div className="button-container">
        <button className={classes.button}>Sign in</button>
        <button className={classes.button}>Sign up</button>
      </div>
    </div>
  );
}

export default Navbar;
