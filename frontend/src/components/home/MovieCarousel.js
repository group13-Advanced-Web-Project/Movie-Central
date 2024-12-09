import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/MovieCarousel.css';

const serverUrl = process.env.REACT_APP_API_URL;

const shuffleMovies = (movies) => {
  const shuffled = [...movies];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MovieCarousel = () => {
  const [shuffledMovies, setShuffledMovies] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${serverUrl}/movies/trending-movies`);
        if (!response.ok) {
          throw new Error('Movies not found');
        }
        const movies = await response.json();
        setShuffledMovies(shuffleMovies(movies));
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchMovies();
  }, []);

  const loopedMovies = [...shuffledMovies, ...shuffledMovies, ...shuffledMovies]; 

  return (
    <div className="feed2-container">
      <div className="feed2-header">
        <h2 className="feed-heading">Top Movies of the Week</h2>
      </div>
      <div
        className={`carousel-wrapper ${isPaused ? 'paused' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="carousel">
          {loopedMovies.map((movie, index) => (
            <div key={index} className="carousel-item">
              <Link to={`/movie/${movie.title}`}>
                <img
                  src={movie.poster_path || '/assets/sample_image.jpg'}
                  alt={movie.title}
                  className="movie-image"
                />
              </Link>
              <Link to={`/movie/${movie.title}`} className="movie-name-link">
                <p className="movie-name-carousel">{movie.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
