import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../styles/MoviePage.css';
import useFetchedMovies from '../useFetchedMovies'; 

function MoviePage() {
    const { movieName } = useParams();
    const { movies, loading, error } = useFetchedMovies();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        if (movies && movies.length > 0) {
            const foundMovie = movies.find(movie => 
                movie.title?.toLowerCase().trim() === movieName.toLowerCase().trim()
            );
            if (foundMovie) {
                setMovie(foundMovie);
            }
        }
    }, [movies, movieName]);

    return (
        <div className="home-container">
            <Navbar />
            <div className="moviepage-main">
                {loading && (
                    <div className="moviepage-loading-message">Loading...</div>
                )}
                {error && (
                    <div className="moviepage-error-message">Error: {error}</div>
                )}
                {!loading && !error && !movie && (
                    <div className="moviepage-error-message">Movie not found</div>
                )}
                {movie && (
                    <div className="moviepage-container">
                        <div className="moviepage-details">
                            <img 
                                src={movie.imageUrl || '/assets/sample_image.jpg'} 
                                alt={movie.title || "Sample Movie"} 
                                className="moviepage-poster" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/sample_image.jpg';
                                }}
                            />
                            <div className="moviepage-info">
                                <h1>{movie.title}</h1>
                                <p><strong>Overview:</strong> {movie.description}</p>
                                <p><strong>Release Year:</strong> {movie.year}</p>
                                <p><strong>Duration:</strong> {movie.duration} minutes</p>
                                <p><strong>Genres:</strong> {movie.genres}</p>
                                <p><strong>Rating:</strong> {movie.rating}</p>
                                <p><strong>Cast:</strong> {movie.cast}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default MoviePage;
