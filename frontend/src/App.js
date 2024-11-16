import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { useAuth0 } from "@auth0/auth0-react";

import Home from './pages/home/Home';
import Showtimes from './pages/Showtimes/Showtimes';
import Moviepage from './pages/moviepage/MoviePage'; 
import useMovies from './pages/Showtimes/UseMovies'; 
import Profile from './pages/Profile';

function App() {
  const { user, isAuthenticated } = useAuth0(); 

  const [accountRegistered, setAccountRegistered] = React.useState(false);
  const { movies, fetchMovies } = useMovies();

  const handleCheckAccount = async () => {
    const userId = user.sub;
    console.log("Sending user ID to server:", userId);

    const response = await fetch("http://localhost:3001/users/check-account", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify({ auth0_user_id: userId })
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
    const postData = { auth0_user_id: user.sub };
    console.log("Sending POST data:", postData);

    const response = await fetch("http://localhost:3001/users/add", {
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
        <Route path="/" element={<Home movies={movies} />} />
        <Route path="/movie/:movieName" element={<Moviepage />} />
        <Route path="/showtimes" element={<Showtimes movies={movies} fetchShowSchedule={fetchMovies} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
