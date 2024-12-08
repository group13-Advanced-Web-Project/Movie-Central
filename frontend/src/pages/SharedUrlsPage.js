import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/SharedUrlsPage.css";


function getInitials(nickname) {
  if (!nickname || nickname.trim() === "") {
    return "No name"; 
  }

  const words = nickname.trim().split(" "); 
  const initials = words.map(word => word[0]).slice(0, 2); 
  return initials.join("").toUpperCase(); 
}

function SharedURLPage() {
  // State to store data
  const [urls, setUrls] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch the shared URLs when the component loads
  useEffect(() => {
    async function fetchUrls() {
      setLoading(true); 
      setError(null); 

      try {
        const baseUrl = process.env.REACT_APP_API_URL; 
        if (!baseUrl) throw new Error("API base URL is not set."); 

        const response = await fetch(`${baseUrl}/shared-url/shareable-urls`); 
        if (!response.ok) throw new Error(`Error: ${response.statusText}`); 

        const data = await response.json(); 
        const validUrls = data.filter(item => item.shareable_url); 

        if (validUrls.length === 0) throw new Error("No valid URLs found."); 
        setUrls(validUrls); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    }

    fetchUrls(); 
  }, []); 

  return (
    <div>
      <Navbar /> 
      <main className="shared-urls-container">
        {loading && <p>Loading...</p>}
        {!loading && error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            <h1>Shared Profiles</h1>
            <ul className="shared-profiles-list">
              {urls.map(item => (
                <li key={item.user_id} className="shared-profile-item">
                  <div className="profile-circle">
                    {/* Display initials */}
                    <span>{getInitials(item.nickname)}</span>
                  </div>
                  <div className="profile-info">
                    {/* Display nickname and URL */}
                    <strong>{item.nickname || "Anonymous"}</strong>
                    <a
                      href={item.shareable_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.shareable_url}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      <Footer /> 
    </div>
  );
}

export default SharedURLPage;
