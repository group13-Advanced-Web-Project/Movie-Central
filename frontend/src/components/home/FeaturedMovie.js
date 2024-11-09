import React, { useEffect, useState } from 'react';
import '../../styles/FeaturedMovie.css';

function FeaturedMovie({ movies }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Ensure that the movies are not empty and only run once after movies are fetched
    if (movies && movies.length > 0 && !movie) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovie(randomMovie);
    }
  }, [movies, movie]); // Add movie as a dependency to prevent reruns once it's set

  return (
    <div className="feed1-container">
      <div className="feed2-header">
        <h2 className="feed-heading">Featured Today</h2>
      </div>
      {movie ? (
        <div className="movie-details">
          <img src={movie.imageUrl} alt={movie.title} className="large-movie-image" />
          <div className="movie-info">
            <h2>{movie.title}</h2>
            <p><strong>Description:</strong> {movie.description || 'No Description Available'}</p>
            <p><strong>Genres:</strong> {movie.genres || 'No Genres Available'}</p>
            <p><strong>Duration:</strong> {movie.duration || 'Unknown'} minutes</p>
            <p><strong>Rating:</strong> {movie.rating || 'No Rating Available'}</p>
            <p><strong>Cast:</strong> {movie.cast || 'No Cast Information'}</p>
          </div>
        </div>
      ) : (
        <p>Loading random movie...</p>
      )}
    </div>
  );
}

export default FeaturedMovie;
