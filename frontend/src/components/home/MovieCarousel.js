import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../../styles/MovieCarousel.css';

const MovieCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 3 + movies.length) % movies.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 3) % movies.length
    );
  };

  return (
    <div className="feed2-container">
      <div className="feed2-header">
        <h2 className="feed-heading">Top Movies of the Week</h2>
      </div>
      <div className="carousel-wrapper">
        <button onClick={handlePrev} className="carousel-btn prev">❮</button>
        <div className="carousel">
          {movies.slice(currentIndex, currentIndex + 3).map((movie, index) => (
            <div key={index} className="carousel-item">
              <Link to={`/movie/${movie.title}`}>
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="movie-image"
                />
              </Link>
              <Link to={`/movie/${movie.title}`} className="movie-name-link">
                <p className="movie-name">{movie.title}</p>
              </Link>
            </div>
          ))}
        </div>
        <button onClick={handleNext} className="carousel-btn next">❯</button>
      </div>
    </div>
  );
};

export default MovieCarousel;
