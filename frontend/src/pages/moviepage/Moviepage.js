import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the search term from the URL
import Navbar from '../../components/Navbar'; // Adjust the path based on your folder structure
import Footer from '../../components/Footer'; // Adjust the path based on your folder structure
import '../../styles/Moviepage.css'; // Optional for styling


function Moviepage() {
    const { movieName } = useParams(); // Get the movie name from the URL
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
          setMovie(data[0]); // Assuming only one movie matches the name
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
          <div className="error-message">Error: {error}</div>
          <Footer />
        </div>
      );
    }
  
    if (!movie) {
      return (
        <div>
          <Navbar />
          <div className="loading-message">Loading...</div>
          <Footer />
        </div>
      );
    }
  
    return (
      <div>
        <Navbar />
        
        <div className="moviepage-container">
          <div className="movie-details">
            <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
              <h1>{movie.title}</h1>
              <p><strong>Overview:</strong> {movie.overview}</p>
              <p><strong>Release Date:</strong> {movie.release_date}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  export default Moviepage;