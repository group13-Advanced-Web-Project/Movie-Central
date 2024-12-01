import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/PublicProfile.css";

const serverUrl = process.env.REACT_APP_API_URL; // Backend base URL
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY; // TMDB API Key

const PublicProfile = () => {
    const { id } = useParams(); // Extract user ID (database ID) from the URL
    const [profileData, setProfileData] = useState({
        user: null,
        favoriteMovies: [],
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize navigation hook

    // Function to fetch the user's public profile
    const fetchPublicProfile = async () => {
        try {
            const response = await fetch(`${serverUrl}/public/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Failed to fetch profile");
                setLoading(false);
                return;
            }

            const data = await response.json();
            const { user, favorites } = data;

            // Fetch movie details for the favorites
            const movieDetailsPromises = favorites.map((movieId) =>
                fetchMovieDetails(movieId)
            );
            const movieDetails = await Promise.all(movieDetailsPromises);

            setProfileData({
                user,
                favoriteMovies: movieDetails.filter((details) => details !== null),
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching public profile:", err.message);
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    // Function to fetch movie details from TMDB
    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${TMDB_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error(`Error fetching details for movie ID: ${movieId}`, error.message);
            return null;
        }
    };

    useEffect(() => {
        fetchPublicProfile();
    }, [id]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="public-profile-container">
                    <h1>Loading...</h1>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="public-profile-container">
                    <h1>Error</h1>
                    <p>{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="public-profile-container">
                {/* Left Panel */}
                <div className="left-panel">
                    <h1>Public Profile</h1>
                    <div className="user-info">
                        <div className="user-avatar">
                            {profileData.user?.picture ? (
                                <img src={profileData.user.picture} alt="User Avatar" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {profileData.user?.email.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <p><strong>Email:</strong> {profileData.user.email}</p>
                        <p><strong>Role:</strong> {profileData.user.role}</p>
                        <p><strong>Nickname:</strong> {profileData.user.nickname || "N/A"}</p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="right-panel">
                    <div className="favorite-movies-section">
                        <h2>Favorite Movies</h2>
                        <div className="movie-grid">
                            {profileData.favoriteMovies.length > 0 ? (
                                profileData.favoriteMovies.map((movie, index) => (
                                    <div
                                        key={index}
                                        className="movie-card"
                                        onClick={() => navigate(`/movie/${encodeURIComponent(movie.title)}`)} // Navigate to movie page
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title || "No Title"}
                                        />
                                        <p title={movie.title}>{movie.title || "No Title"}</p>
                                        <div className="movie-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        color: i < Math.round(movie.vote_average / 2) ? "#ffc107" : "#ddd",
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                            <span> ({movie.vote_average})</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No favorite movies to display.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PublicProfile;
