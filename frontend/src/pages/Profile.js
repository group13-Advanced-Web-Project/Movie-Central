import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const serverUrl = process.env.REACT_APP_API_URL;

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  const [userDatabaseInfo, setUserDatabaseInfo] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [shareableLink, setShareableLink] = useState(""); 

  const getAccountInfo = async () => {
    const postData = { auth0_user_id: user.sub };

    const response = await fetch(serverUrl + "/users/user-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify(postData),
    });
    setUserDatabaseInfo(await response.json());
  };

  const fetchMovieLists = async () => {
    const postData = { auth0_user_id: user.sub };

    const favoritesResponse = await fetch(serverUrl + "/movies/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify(postData),
    });
    setFavoriteMovies(await favoritesResponse.json());

    const watchlistResponse = await fetch(serverUrl + "/movies/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify(postData),
    });
    setWatchlist(await watchlistResponse.json());

    const watchedResponse = await fetch(serverUrl + "/movies/watched", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify(postData),
    });
    setWatchedMovies(await watchedResponse.json());
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin; // Base URL of the app
    const link = `${baseUrl}/public-profile?email=${encodeURIComponent(
      user.email
    )}&nickname=${encodeURIComponent(user.nickname)}&picture=${encodeURIComponent(
      user.picture
    )}`;
    setShareableLink(link);
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAccountInfo();
      fetchMovieLists();
    }
  }, [isAuthenticated]);

  const handleRemoveAccountClick = async () => {
    const postData = { auth0_user_id: user.sub };

    const response = await fetch(serverUrl + "/users/remove-account", {
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

  return (
    <div>
      <Navbar />
      <div className="profile-layout">
        {isAuthenticated ? (
          <>
            {/* Left Section: User Details */}
            <div className="profile-details">
              <h2 className="section-title">User Details</h2>
              <img src={user.picture} alt={user.name} className="profile-picture" />
              <h3 className="user-name">{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nickname:</strong> {user.nickname}</p>
              <p><strong>Sub (User ID):</strong> {user.sub}</p>
              <p><strong>Email Verified:</strong> {user.email_verified ? "Yes" : "No"}</p>
              <h2 className="section-title">Database Info</h2>
              {userDatabaseInfo.length > 0 ? (
                userDatabaseInfo.map((dbInfo, index) => (
                  <div key={index}>
                    <p><strong>Database ID:</strong> {dbInfo.id}</p>
                    <p><strong>User ID:</strong> {dbInfo.user_id}</p>
                  </div>
                ))
              ) : (
                <p>No database information available</p>
              )}
              <button onClick={handleRemoveAccountClick} className="remove-btn">
                Remove Account
              </button>
              <button onClick={() => navigate("/admin")} className="admin-btn">
                Admin Dashboard
              </button>
              <button onClick={generateShareableLink} className="shareable-btn">
                Share Profile
              </button>
              {shareableLink && (
                <div className="shareable-link">
                  <p>Shareable Link:</p>
                  <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                    {shareableLink}
                  </a>
                </div>
              )}
            </div>

            {/* Center Section: Favorites */}
            <div className="profile-favorites">
              <h2 className="section-title">My Favorites</h2>
              <div className="movie-grid">
                {favoriteMovies.map((movie, index) => (
                  <div key={index} className="movie-card">
                    <img
                      src={movie.poster_path || "/assets/sample_image.jpg"}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <p className="movie-title">{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section: Watchlist and Watched */}
            <div className="profile-watchlist">
              <div className="watched-section">
                <h2 className="section-title">Watched</h2>
                <div className="movie-grid">
                  {watchedMovies.map((movie, index) => (
                    <div key={index} className="movie-card">
                      <img
                        src={movie.poster_path || "/assets/sample_image.jpg"}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <p className="movie-title">{movie.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="watchlist-section">
                <h2 className="section-title">Watchlist</h2>
                <div className="movie-grid">
                  {watchlist.map((movie, index) => (
                    <div key={index} className="movie-card">
                      <img
                        src={movie.poster_path || "/assets/sample_image.jpg"}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <p className="movie-title">{movie.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
