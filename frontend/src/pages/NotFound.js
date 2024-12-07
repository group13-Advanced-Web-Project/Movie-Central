import React from "react";
import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src={"/assets/404image.webp"} alt="404 Not Found" className="not-found-image" />
      <h1 className="not-found-title">Oops! Page Not Found</h1>
      <p className="not-found-description">
        The page you are looking for does not exist or has been moved.
      </p>
      <a href="/" className="btn-home">
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
