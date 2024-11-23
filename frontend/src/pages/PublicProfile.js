import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PublicProfile = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/users/public-profile?userId=${userId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error("Error fetching public profile:", error);
            }
        };

        if (userId) fetchProfileData();
    }, [userId]);

    if (!profileData) return <p>Loading...</p>;

    return (
        <div>
            <div>
                <img src={profileData.picture} alt={profileData.nickname} />
                <h1>{profileData.nickname}</h1>
                <p>Email: {profileData.email || "Email not shared publicly"}</p>
            </div>
            <div>
                <h2>Favorite Movies</h2>
                {profileData.favoriteMovies.length > 0 ? (
                    <div className="movie-grid">
                        {profileData.favoriteMovies.map((movie, index) => (
                            <div key={index} className="movie-card">
                                <img
                                    src={movie.poster_path || "/assets/sample_image.jpg"}
                                    alt={movie.title}
                                />
                                <p>{movie.title}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No favorite movies to display.</p>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;
