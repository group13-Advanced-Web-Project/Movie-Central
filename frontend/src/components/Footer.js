import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <p>&copy; {new Date().getFullYear()} Movie App. All rights reserved.</p>
      <div className="footer-links">
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
        <a href="#privacy">Privacy Policy</a>
      </div>
      <div className="social-media">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="/facebook.png" alt="Facebook" className="social-icon" />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="/twitter.png" alt="Twitter" className="social-icon" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <img src="/instagram.png" alt="Instagram" className="social-icon" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
