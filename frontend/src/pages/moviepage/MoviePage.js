import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 
import '../../styles/MoviePage.css'; 

function MoviePage() {
    const { movieName } = useParams(); 
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchMovie = async () => {
        try {
          const response = await fetch(`http://localhost:3001/search-movies?query=${encodeURIComponent(movieName)}`);
          if (!response.ok) {
            throw new Error('Movie not found');
          }
  
          const data = await response.json();
          setMovie(data[0]); 
        } catch (err) {
          setError(err.message);
          setMovie(null);
        }
      };
  
      fetchMovie();
    }, [movieName]);
  
    if (error) {
      return (
        <div>
          <Navbar />
          <div className="moviepage-error-message">Error: {error}</div>
          <Footer />
        </div>
      );
    }
  
    if (!movie) {
      return (
        <div>
          <Navbar />
          <div className="moviepage-loading-message">Loading...</div>
          <Footer />
        </div>
      );
    }
  
    return (
      <div className="moviepage-main">
        <Navbar />
        
        <div className="moviepage-container">
          <div className="moviepage-details">
          <img 
              src={movie.poster_path || '/assets/sample_image.jpg'} 
              alt={movie.title || "Sample Movie"} 
              className="moviepage-poster" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/sample_image.jpg';
              }}
            />
            <div className="moviepage-info">
              <h1>{movie.title}</h1>
              <p><strong>Overview:</strong> {movie.overview}</p>
              <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
              <p><strong>Release Date:</strong> {movie.release_date}</p>
            </div>
          </div>
          
          <div className="moviepage-showtime">
            <h2>Movie Showtime</h2>
            <p>Details will be added later.</p>
          </div>
          
        </div>
        <Footer />
      </div>
    );
}
  
export default MoviePage;
