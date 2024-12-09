import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PublicProfile from "../pages/PublicProfile";
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

import "../styles/Profile.css";

const serverUrl = process.env.REACT_APP_API_URL

const Profile = () => {
    const { user, isAuthenticated, logout } = useAuth0();
    const navigate = useNavigate();

    const [userDatabaseInfo, setUserDatabaseInfo] = React.useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [ratings, setRatings] = useState({});
    const [shareableLink, setShareableLink] = useState("");

    const getAccountInfo = async () => {
        const postData = { auth0_user_id: user.sub };
        const response = await fetch(`${serverUrl}/users/user-info`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
            },
            body: JSON.stringify(postData),
        });
        setUserDatabaseInfo(await response.json());
    };

    const fetchMovieDetails = async (movieId) => {
        const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
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

    const fetchMovieRatings = async (movieId) => {
        try {
            const response = await fetch(`${serverUrl}/reviews/movie/${movieId}`);
            if (response.ok) {
                const reviews = await response.json();
                if (reviews.length > 0) {
                    const averageRating = (
                        reviews.reduce((sum, review) => sum + review.rating, 0) /
                        reviews.length
                    ).toFixed(1);
                    return averageRating;
                }
            }
        } catch (error) {
            console.error(`Error fetching ratings for movie ID: ${movieId}`, error.message);
        }
        return null;
    };

    const fetchMovieLists = async () => {
        try {
            const response = await fetch(`${serverUrl}/favorites/${user.sub}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
                },
            });

            if (!response.ok) {
                console.error("Error fetching favorite movie IDs.");
                return;
            }

            const movieIds = await response.json();
            if (movieIds.length === 0) {
                setFavoriteMovies([]);
                return;
            }

            const movieDetailsPromises = movieIds.map((movieId) => fetchMovieDetails(movieId));
            const movieDetails = await Promise.all(movieDetailsPromises);
            const validMovies = movieDetails.filter((details) => details !== null);

            setFavoriteMovies(validMovies);

            const ratingsPromises = movieIds.map((movieId) => fetchMovieRatings(movieId));
            const ratingsData = await Promise.all(ratingsPromises);

            const ratingsMap = {};
            movieIds.forEach((movieId, index) => {
                ratingsMap[movieId] = ratingsData[index];
            });
            setRatings(ratingsMap);
        } catch (error) {
            console.error("Unexpected error fetching favorite movies:", error.message);
        }
    };

    const unfavoriteMovie = async (movieId) => {
        try {
            const response = await fetch(`${serverUrl}/favorites`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user.sub, movie_id: movieId }),
            });

            if (response.ok) {
                setFavoriteMovies((prev) =>
                    prev.filter((movie) => movie.id !== movieId)
                );
                alert("Movie removed from favorites.");
            } else {
                console.error("Failed to unfavorite movie.");
            }
        } catch (error) {
            console.error("Error removing favorite:", error.message);
        }
    };

    const navigateToMoviePage = (movieName) => {
        navigate(`/movie/${encodeURIComponent(movieName)}`);
    };

    const generateShareableLink = () => {
        console.log("GENERATE CLICKED")
        if (!userDatabaseInfo[0]?.id) {
            alert("Unable to generate shareable link.");
            return;
        }
    
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/public/${encodeURIComponent(userDatabaseInfo[0].id)}`;
        setShareableLink(link);
    
        // Store public profile data in localStorage
        const storedProfiles = JSON.parse(localStorage.getItem("publicProfiles")) || {};
        storedProfiles[userDatabaseInfo[0].id] = {
            nickname: user.nickname,
            picture: user.picture,
            favoriteMovies,
        };
        localStorage.setItem("publicProfiles", JSON.stringify(storedProfiles));
    };
        
    const saveShareableLinkToBackend = async () => {
        console.log("SAVE CLICKED")

        const { user_id } = userDatabaseInfo[0] || {};
        if (!shareableLink || !user_id) return alert("Unable to save shared URL.");
    
        try {
            const response = await fetch(`${serverUrl}/shared-url/generate-shareable-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, shareable_url: shareableLink }),
            });
    
            const message = response.ok ? "URL was shared successfully." : "Failed to save shared URL.";
            alert(message);
        } catch (error) {
            console.error("Error saving shared URL:", error.message);
            alert("An error occurred while saving the shared URL.");
        }
    };
    

    const handleRemoveAccountClick = async () => {
        const postData = { auth0_user_id: user.sub };
        const response = await fetch(`${serverUrl}/users/remove-account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
            },
            body: JSON.stringify(postData),
        });
        if (response.ok) {
            alert("Account removed successfully");
            logout({ returnTo: window.location.origin });
        } else {
            alert("Failed to remove account");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getAccountInfo();
            fetchMovieLists();
        }
    }, [isAuthenticated]);

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <Navbar />
                    <div className="main-container">
                        {/* Left Panel */}
                        <div className="left-panel">
                            <h1>Profile - Logged In</h1>
                            <h2>Auth0 Details</h2>
                            <img
                                src={user.picture}
                                alt={user.name}
                                style={{ width: "150px", borderRadius: "50%" }}
                            />
                            <h2>{user.name}</h2>
                            <p>
                                <strong>Email:</strong> {user.email || "N/A"}
                            </p>
                            <p>
                                <strong>Nickname:</strong> {user.nickname || "N/A"}
                            </p>
                            <p>
                                <strong>Sub (User ID):</strong> {user.sub || "N/A"}
                            </p>
                            <p>
                                <strong>Email Verified:</strong>{" "}
                                {user.email_verified ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>Given Name:</strong> {user.given_name || "N/A"}
                            </p>
                            <p>
                                <strong>Family Name:</strong> {user.family_name || "N/A"}
                            </p>

                            <h2>Database Info</h2>
                            {userDatabaseInfo.length > 0 ? (
                                userDatabaseInfo.map((user, index) => (
                                    <div key={index}>
                                        <p>
                                            <strong>Database id:</strong> {user.id || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Database user_id:</strong> {user.user_id || "N/A"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No database information available</p>
                            )}

                            <div>
                                <button onClick={handleRemoveAccountClick}>Remove account</button>
                            </div>
                            <div>
    <button onClick={generateShareableLink}>Generate Shareable Profile</button>
    {shareableLink && (
        <div className="share-link-container">
            <p>Your shareable profile link:</p>
            <a
                href={shareableLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                {shareableLink}
            </a>
            <button
                onClick={() => navigator.clipboard.writeText(shareableLink)}
            >
                Copy to Clipboard
            </button>
            <button
                onClick={saveShareableLinkToBackend}
            >
                Share
            </button>
        </div>
    )}
</div>
                            <div>
                                <button onClick={() => navigate('/admin')}>Admin Dash</button>
                            </div>
                        </div>

                        {/* Center Panel */}
                        <div className="center-panel">
                            <h2>My Favorites</h2>
                            <div className="movie-grid">
                                {favoriteMovies.length === 0 ? (
                                    <p>No favorite movies...</p>
                                ) : (
                                    favoriteMovies.map((movie, index) => (
                                        <div
                                            key={index}
                                            className="movie-card"
                                            onClick={() => navigateToMoviePage(movie.title)}
                                        >
                                            <img
                                                src={
                                                    movie.poster_path
                                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                        : "/assets/sample_image.jpg"
                                                }
                                                alt={movie.title || "No Movie Title"}
                                                className="movie-poster"
                                            />
                                            <p className="movie-title">{movie.title || "No Movie Title"}</p>
                                            <div className="movie-rating">
                                                <span
                                                    style={{
                                                        color: "red",
                                                        fontSize: "1.5rem",
                                                        marginRight: "5px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        unfavoriteMovie(movie.id);
                                                    }}
                                                >
                                                    ♥
                                                </span>
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        color={
                                                            i < Math.round(ratings[movie.id] || 0)
                                                                ? "#ffc107"
                                                                : "#e4e5e9"
                                                        }
                                                    />
                                                ))}
                                                <span>
                                                    {ratings[movie.id]
                                                        ? `(${ratings[movie.id]}/5)`
                                                        : "(No Rating)"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="right-panel">
                            <div className="section">
                                <h2>Watched</h2>
                                <div className="movie-grid">
                                    {watchedMovies.map((movie, index) => (
                                        <div key={index} className="movie-card">
                                            <img
                                                src={movie.poster_path || "/assets/sample_image.jpg"}
                                                alt={movie.title}
                                            />
                                            <p>{movie.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="section">
                                <h2>Watchlist</h2>
                                <div className="movie-grid">
                                    {watchlist.map((movie, index) => (
                                        <div key={index} className="movie-card">
                                            <img
                                                src={movie.poster_path || "/assets/sample_image.jpg"}
                                                alt={movie.title}
                                            />
                                            <p>{movie.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </>
            ) : (
                <div>
                    <Navbar />
                    <h1>Profile</h1>
                    <p>Log in to see your profile</p>
                    <Footer />
                </div>
            )}
        </div>
    );
};

export default Profile;
