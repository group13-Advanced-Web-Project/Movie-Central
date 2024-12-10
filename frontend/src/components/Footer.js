import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <p>&copy; {new Date().getFullYear()} Movie-Central. All rights reserved.</p>
      <div className="footer-links">
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
        <a href="#privacy">Privacy Policy</a>
      </div>      
    </div>
  );
}

export default Footer;
