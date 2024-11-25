import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PublicProfile from "../pages/PublicProfile";
import { useNavigate } from 'react-router-dom';
import "../styles/Profile.css";

const serverUrl = process.env.REACT_APP_API_URL


const Profile = () => {
    const { user, isAuthenticated, logout } = useAuth0();
    const navigate = useNavigate();

    const [userDatabaseInfo, setUserDatabaseInfo] = React.useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [shareableLink, setShareableLink] = useState("");
    const [showPublicProfile, setShowPublicProfile] = useState(false); // State to toggle PublicProfile

    const getAccountInfo = async () => {
        const postData = { auth0_user_id: user.sub };
        console.log("Sending POST data:", postData);


        const response = await fetch(serverUrl+"/users/user-info", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
            },
            body: JSON.stringify(postData),
        });
        setUserDatabaseInfo(await response.json());

        console.log(response);
        console.log(userDatabaseInfo);
    };

    const fetchMovieLists = async () => {
        const postData = { user_id: user.sub };
        console.log("Sending POST data:", postData);
    
        const favoritesResponse = await fetch(serverUrl + "/favorites/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
            },
            body: JSON.stringify(postData),
        });
    
        if (!favoritesResponse.ok) {
            // Handle fetch errors
            const errorData = await favoritesResponse.json();
            console.error("Error fetching favorites:", errorData.error || "Unknown error");
            return;
        }
    
        const favoritesData = await favoritesResponse.json();
        console.log("Favorites data:", favoritesData);
    
        // Check if the favorites array is empty
        if (favoritesData.length === 0) {
            console.log("No favorite movies found.");
        } else {
            setFavoriteMovies(favoritesData); 
        }
    };
    

    const generateShareableLink = () => {
        if (!userDatabaseInfo[0]?.id) {
            alert("Unable to generate shareable link. Please try again.");
            return;
        }
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/public-profile?userId=${encodeURIComponent(
            userDatabaseInfo[0].id
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
        console.log("Sending POST data:", postData);


        const response = await fetch(serverUrl+"/users/remove-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
            },
            body: JSON.stringify(postData),
        });
        console.log("Payload being sent to backend:", JSON.stringify(postData));

        console.log(response);
    

        if (response.ok) {
            alert("Account removed successfully");
            logout({ returnTo: window.location.origin });
        } else {
            alert("Failed to remove account");
        }
    };

    return (
        <>
            {isAuthenticated ? (
                <div>
                    <Navbar />
                    {showPublicProfile ? (
                        <PublicProfile />
                    ) : (
                        <div className="main-container">
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
                                    <button onClick={generateShareableLink}>Share Profile</button>
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
                                                onClick={() =>
                                                    navigator.clipboard.writeText(shareableLink)
                                                }
                                            >
                                                Copy to Clipboard
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button onClick={() => setShowPublicProfile(true)}>
                                        View Public Profile
                                    </button>
                                </div>
                                <div>
                                    <button onClick={() => navigate('/admin')}>Admin Dash</button>
                                </div>

                            </div>

                            

                            <div className="center-panel">
                                <h2>My Favorites</h2>
                                <div className="movie-grid">
                                {favoriteMovies.length === 0 ? (
    <p>No favorite movies available.</p>
) : (
    favoriteMovies.map((movie, index) => (
        <div key={index} className="movie-card">
         
            <p>Fave Movie Id:{movie}</p>
        </div>
    ))
)}

                                </div>
                            </div>

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
                    )}
                    <Footer />
                </div>
            ) : (
                <div>
                    <Navbar />
                    <h1>Profile</h1>
                    <p>Log in to see your profile</p>
                    <Footer />
                </div>
            )}
        </>
    );
};

export default Profile;
