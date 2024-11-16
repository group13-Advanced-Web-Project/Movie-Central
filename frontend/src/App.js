import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/home/Home';
import Showtimes from './pages/Showtimes/Showtimes';
import MoviePage from './pages/moviepage/MoviePage'; 
import useMovies from './pages/Showtimes/UseMovies';
import GenrePage from './pages/home/GenrePage.js';  // Import GenrePage
import YearPage from './pages/home/YearPage.js';  // Import YearPage


function App() {
  const { movies, fetchMovies } = useMovies();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieName" element={<MoviePage />} />
        <Route path="/showtimes" element={<Showtimes movies={movies} fetchShowSchedule={fetchMovies} />} />
        <Route path="/genre/:genre" element={<GenrePage />} />    {/* Add GenrePage route */}
        <Route path="/year/:year" element={<YearPage />} />      {/* Add YearPage route */}
      </Routes>
    </Router>
  );
}

export default App;
