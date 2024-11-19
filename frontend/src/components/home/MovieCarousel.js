import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import '../../styles/MovieCarousel.css';

// Fisher-Yates shuffle function
const shuffleMovies = (movies) => {
  const shuffled = [...movies]; 
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
  }
  return shuffled;
};

const MovieCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledMovies, setShuffledMovies] = useState([]); 

  
  useEffect(() => {
    const shuffled = shuffleMovies(movies);
    setShuffledMovies(shuffled); 
  }, [movies]);

 
  const loopedMovies = [...shuffledMovies, ...shuffledMovies]; 

  // Automatically move the carousel slowly to the left
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % shuffledMovies.length
      );
    }, 5000); 

    return () => clearInterval(interval); 
  }, [shuffledMovies.length]);

  return (
    <div className="feed2-container">
      <div className="feed2-header">
        <h2 className="feed-heading">Top Movies of the Week</h2>
      </div>
      <div className="carousel-wrapper">
        <div className="carousel" style={{ transform: `translateX(-${(currentIndex * 155)}px)` }}>
          {loopedMovies.slice(0, shuffledMovies.length).map((movie, index) => (
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
      </div>
    </div>
  );
};

export default MovieCarousel;
