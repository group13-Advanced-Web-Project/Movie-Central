import React from 'react';
import '../../styles/Showtimes.css';

const ShowtimeCard = ({ movie }) => {
  if (!movie) return <p>No movie data available.</p>;

  return (
    <div className="movie-card">
      {/* Theater Name */}
      <h3 className="theater-name">{movie.theater}</h3>

      {/* Movie Poster */}
      <div className="image-container">
        {movie.imageUrl ? (
          <img src={movie.imageUrl} alt={movie.title} className="image-card" />
        ) : (
          <div className="image-placeholder">Image Not Available</div>
        )}
      </div>

      {/* Movie Title */}
      <div className="movie-info">
        <p className="movie-title">
          {movie.title}
          {movie.auditoriums[0]?.presentationMethod || movie.auditoriums[0]?.language ? (
            <span>
              {' '}
              ({movie.auditoriums[0]?.presentationMethod}
              {movie.auditoriums[0]?.language ? `, ${movie.auditoriums[0]?.language}` : ''})
            </span>
          ) : null}
        </p>

        {/* Showtimes */}
        <div className="showtimes-list">
          {movie.auditoriums.map((auditorium) =>
            auditorium.showtimes.map((showtime) => (
              <div key={`${auditorium.auditorium}-${showtime}`} className="showtime-item">
                <strong>{showtime}</strong>{' '}
                <span className="auditorium-info">({auditorium.auditorium})</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowtimeCard;
