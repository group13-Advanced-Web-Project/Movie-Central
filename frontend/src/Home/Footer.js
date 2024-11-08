
import React from 'react';
import '../Css/Footer.css';
import facebookIcon from '../components/facebook.png'; // Import social media icons
import twitterIcon from '../components/twitter.png';
import instagramIcon from '../components/instagram.png';

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
          <img src={facebookIcon} alt="Facebook" className="social-icon" />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <img src={twitterIcon} alt="Twitter" className="social-icon" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <img src={instagramIcon} alt="Instagram" className="social-icon" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
