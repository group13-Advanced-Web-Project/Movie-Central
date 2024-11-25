import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../../styles/FeaturedMovie.css';

const serverUrl = process.env.REACT_APP_API_URL;
// const serverUrl = 'http://localhost:3001';

function FeaturedMovie() {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); 
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
        fetchReviews(data.id); 
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async (movieId) => {
      try {
        const response = await fetch(`${serverUrl}/reviews/movie/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchFeaturedMovie();
  }, []);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 'No Rating Available';
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return `${(totalRating / reviews.length).toFixed(1)} / 5`;
  };

  return (
    <div className="feed1-container">
      <div className="feed2-header">
        <h2 className="feed-heading">Featured Today</h2>
      </div>
      {loading ? (
        <p>Loading random movie...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : movie ? (
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
            <p><strong>Rating:</strong> {calculateAverageRating()}</p>
            <p><strong>Cast:</strong> {movie.cast || 'No Cast Information'}</p>
            <p><strong>Year:</strong> {movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'}</p>
          </div>
        </div>
      ) : (
        <p>No movie found.</p>
      )}
    </div>
  );
}

export default FeaturedMovie;
