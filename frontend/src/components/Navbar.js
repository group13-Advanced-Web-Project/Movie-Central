import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';



function Navbar() {
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const { isAuthenticated } = useAuth0();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();


  const handleInputChange = async (e) => {
    
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await fetch(`http://localhost:3001/search-movies?query=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.length > 0 ? data.slice(0, 4) : []); // Only show top 4 results or empty if no match
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movieTitle) => {
    setSearchTerm(movieTitle);
    setSuggestions([]);
    navigate(`/movie/${encodeURIComponent(movieTitle)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
        setSearchTerm('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

 


  return (
    <div className="header-container">
      <img src="/assets/Movie_App_Logo.png" alt="Movie App Logo" className="logo" />
      <div className="search-container" ref={searchContainerRef}>
        <input
          type="text"
          placeholder="Search Movie"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <ul className="suggestions-list">
          {suggestions.length > 0 ? (
            suggestions.map((movie) => (
              <li key={movie.id} onClick={() => handleSuggestionClick(movie.title)}>
                {movie.title}
              </li>
            ))
          ) : searchTerm.trim() ? (
            <li className="no-results">No results found for "{searchTerm}"</li>
          ) : null}
        </ul>
      </div>
     {!isAuthenticated ? (
      <div className="button-container">
         <button onClick={() => navigate('/')}>Home</button>

         <button onClick={() => navigate('/showtimes')}>Showtimes</button>
        <button className="button"  onClick={() => loginWithRedirect()}>Log In</button>
        <button className="button" onClick={() => loginWithRedirect()}>Sign up</button>
      </div>
     ) : (
      <div className="button-container">
         <button onClick={() => navigate('/')}>Home</button>
         <button onClick={() => navigate('/showtimes')}>Showtimes</button>
        <button onClick={() => navigate('/profile')}>
          Profile
        </button>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Log Out
        </button>
      </div>
     )}
    </div>
  );
}

export default Navbar;
