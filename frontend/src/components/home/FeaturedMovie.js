import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../../styles/FeaturedMovie.css';

// const serverUrl = process.env.REACT_APP_API_URL;
const serverUrl = 'http://localhost:3001';

function FeaturedMovie({ movies }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const response = await fetch(`${serverUrl}/movies/featured-movie`);
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedMovie();
  }, []);

  return (
    <div className="feed1-container">
      <div className="feed2-header">
        <h2 className="feed-heading">Featured Today</h2>
      </div>
      {movie ? (
        <div className="movie-details">
          <Link to={`/movie/${movie.title}`}>
            <img
              src={movie.poster_path || '/assets/sample_image.jpg'}
              alt={movie.title}
              className="large-movie-image"
            />
          </Link>
          <div className="movie-info">
            <Link to={`/movie/${movie.title}`} className="movie-title-link">
              <h2>{movie.title}</h2>
            </Link>
            <p><strong>Description:</strong> {movie.overview || 'No Description Available'}</p>
            <p><strong>Genres:</strong> {movie.genres || 'No Genres Available'}</p>
            <p><strong>Duration:</strong> {movie.duration || 'Unknown'} minutes</p>
            <p><strong>Rating:</strong> {movie.rating || 'No Rating Available'}</p>
            <p><strong>Cast:</strong> {movie.cast || 'No Cast Information'}</p>
            <p><strong>Year:</strong> {movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'}</p>
          </div>
        </div>
      ) : (
        <p>Loading random movie...</p>
      )}
    </div>
  );
}

export default FeaturedMovie;
