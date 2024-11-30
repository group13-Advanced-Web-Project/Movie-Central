import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicProfile = () => {
    const location = useLocation();
    const [profileData, setProfileData] = useState({
        nickname: "Unknown User",
        picture: "/assets/sample_image.jpg",
        favoriteMovies: [],
    });

    useEffect(() => {
        if (location.state) {
            setProfileData(location.state);
        } else {
            const storedData = localStorage.getItem("publicProfileData");
            if (storedData) {
                setProfileData(JSON.parse(storedData));
            }
        }
    }, [location.state]);

    return (
        <div>
            <Navbar />
            <div className="public-profile-container">
                <h1>Public Profile</h1>
                <div className="user-info">
                    <img
                        src={profileData.picture || "/assets/sample_image.jpg"}
                        alt={`${profileData.nickname}'s Profile`}
                        style={{ width: "150px", borderRadius: "50%" }}
                    />
                    <h2>{profileData.nickname || "Unknown User"}</h2>
                </div>
                <div className="favorite-movies-section">
                    <h2>Favorite Movies</h2>
                    <div className="movie-grid">
                        {profileData.favoriteMovies.length > 0 ? (
                            profileData.favoriteMovies.map((movie, index) => (
                                <div key={index} className="movie-card">
                                    <img
                                        src={
                                            movie.poster_path
                                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                : "/assets/sample_image.jpg"
                                        }
                                        alt={movie.title || "No Movie Title"}
                                    />
                                    <p>{movie.title || "No Movie Title"}</p>
                                </div>
                            ))
                        ) : (
                            <p>No favorite movies to display.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PublicProfile;
