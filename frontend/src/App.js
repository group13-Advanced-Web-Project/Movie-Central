import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { useAuth0 } from "@auth0/auth0-react";

import Home from './pages/home/Home';
import Showtimes from './pages/Showtimes/Showtimes';
import MoviePage from './pages/moviepage/MoviePage'; 
import GenrePage from './pages/home/GenrePage.js';  
import YearPage from './pages/home/YearPage.js';  
import useMovies from './pages/Showtimes/UseMovies'; 
import Profile from './pages/Profile';
import AdminPage from './pages/admin/AdminPage.js';
import ReviewPage from './pages/ReviewPage.js';
import PublicProfile from './pages/PublicProfile.js';

const serverUrl = process.env.REACT_APP_API_URL

function App() {
  const { user, isAuthenticated } = useAuth0(); 

  const [accountRegistered, setAccountRegistered] = React.useState(false);
  const { movies, fetchMovies } = useMovies();
  
  const handleCheckAccount = async () => {
    const userId = user.sub;
    console.log("Sending user ID to server:", userId);

    const response = await fetch(serverUrl+"/users/check-account", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify({ auth0_user_id: userId, email: user.email })
    });

    console.log(response);

    if (response.ok) {
      setAccountRegistered(true);
      return response;
    } else {
      setAccountRegistered(false);
      return response;
    }
  };

  const handleCreateAccount = async () => {
    const postData = { auth0_user_id: user.sub, email: user.email };
    console.log("Sending POST data:", postData);

    const response = await fetch(serverUrl+"/users/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify(postData)
    });

    console.log(response);

    if (response.ok) {
      setAccountRegistered(true);
    } else {
      console.error("Failed to create account");
    }
  };

  useEffect(() => {
    if (isAuthenticated && !accountRegistered) {
      handleCheckAccount().then((response) => {
        if (response.status === 404) {
          handleCreateAccount();
        }
      });
    }
  }, [isAuthenticated, accountRegistered]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieName" element={<MoviePage />} />
        <Route path="/showtimes" element={<Showtimes movies={movies} fetchShowSchedule={fetchMovies} />} />
        <Route path="/genre/:genre" element={<GenrePage />} />   
        <Route path="/year/:year" element={<YearPage />} />      
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/movies/:movie_id" element={<MoviePage />} />
        <Route path="/publicProfile/:dbId" element={<PublicProfile />} />       
      </Routes>
    </Router>
  );
}

export default App;
