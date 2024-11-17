import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../../styles/FeaturedMovie.css';

function FeaturedMovie({ movies }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (movies && movies.length > 0 && !movie) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovie(randomMovie);
    }
  }, [movies, movie]);

  return (
    <div className="feed1-container">
      <div className="feed2-header">
        <h2 className="feed-heading">Featured Today</h2>
      </div>
      {movie ? (
        <div className="movie-details">
          <Link to={`/movie/${movie.title}`}>
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="large-movie-image"
            />
          </Link>
          <div className="movie-info">
            <Link to={`/movie/${movie.title}`} className="movie-title-link">
              <h2>{movie.title}</h2>
            </Link>
            <p><strong>Description:</strong> {movie.description || 'No Description Available'}</p>
            <p><strong>Genres:</strong> {movie.genres || 'No Genres Available'}</p>
            <p><strong>Duration:</strong> {movie.duration || 'Unknown'} minutes</p>
            <p><strong>Rating:</strong> {movie.rating || 'No Rating Available'}</p>
            <p><strong>Cast:</strong> {movie.cast || 'No Cast Information'}</p>
            <p><strong>Year:</strong> {movie.year || 'Unknown'}</p>
          </div>
        </div>
      ) : (
        <p>Loading random movie...</p>
      )}
    </div>
  );
}

export default FeaturedMovie;
