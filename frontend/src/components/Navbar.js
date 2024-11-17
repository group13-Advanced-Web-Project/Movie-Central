import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import useFetchedMovies from '../pages/useFetchedMovies';  



function Navbar() {
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const { isAuthenticated } = useAuth0();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const { movies, loading } = useFetchedMovies();  

  const searchContainerRef = useRef(null);
  const genreDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const genreButtonRef = useRef(null);
  const yearButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && movies.length > 0) {
      const yearsSet = new Set();
      const genresSet = new Set();

      movies.forEach((movie) => {
        if (movie.year && movie.year !== 'Unknown') yearsSet.add(movie.year);
        if (movie.genres && movie.genres !== 'No Genre') {
          movie.genres.split(',').forEach((genre) => genresSet.add(genre.trim()));
        }
      });

      setYears(Array.from(yearsSet).sort((a, b) => b - a));
      setGenres(Array.from(genresSet));
    }
  }, [movies, loading]);  // Recompute when movies are updated

  const handleInputChange = async (e) => {
    
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filteredSuggestions = movies
        .filter((movie) => movie.title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 4);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movieTitle) => {
    setSearchTerm(movieTitle);
    setSuggestions([]);
    navigate(`/movie/${encodeURIComponent(movieTitle)}`);
  };

  const handleYearSelect = (year) => {
    navigate(`/year/${year}`);
    setYearDropdownOpen(false);
  };

  const handleGenreSelect = (genre) => {
    navigate(`/genre/${genre}`);
    setGenreDropdownOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleGenreDropdownToggle = () => {
    setGenreDropdownOpen((prevState) => !prevState);
  };

  const handleYearDropdownToggle = () => {
    setYearDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
        setSearchTerm('');
      }

      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target) && !genreButtonRef.current.contains(event.target)) {
        setGenreDropdownOpen(false);
      }

      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target) && !yearButtonRef.current.contains(event.target)) {
        setYearDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

 


  return (
    <div className="header-container">
      <div className="navbar-logo">
        <img src="/assets/Movie_App_Logo.png" alt="Movie App Logo" className="logo" />
      </div>
      <div className="navbar-links">
        <button className="navbar-link" onClick={handleHomeClick}>HOME</button>
        <div className="navbar-item">
          <button className="navbar-link" ref={yearButtonRef} onClick={handleYearDropdownToggle}>YEAR</button>
          {yearDropdownOpen && (
            <div ref={yearDropdownRef} className="navbar-year-dropdown open">
              {years.map((year) => (
                <div key={year} className="navbar-year-dropdown-item" onClick={() => handleYearSelect(year)}>
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="navbar-item">
          <button className="navbar-link" ref={genreButtonRef} onClick={handleGenreDropdownToggle}>GENRES</button>
          {genreDropdownOpen && (
            <div ref={genreDropdownRef} className="navbar-dropdown open">
              {genres.map((genre, index) => (
                <div key={index} className="navbar-dropdown-item" onClick={() => handleGenreSelect(genre)}>
                  {genre}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="search-container" ref={searchContainerRef}>
        <input type="text" placeholder="Search Movie" value={searchTerm} onChange={handleInputChange} />
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
         <button onClick={() => navigate('/showtimes')}>Showtimes</button>
        <button className="button"  onClick={() => loginWithRedirect()}>Log In</button>
        <button className="button" onClick={() => loginWithRedirect()}>Sign up</button>
      </div>
     ) : (
      <div className="button-container">
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
