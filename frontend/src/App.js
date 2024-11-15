import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/home/Home';
import Showtimes from './pages/Showtimes/Showtimes';
import Moviepage from './pages/moviepage/MoviePage'; 
import useMovies from './pages/Showtimes/UseMovies'; 

function App() {
  const { movies, fetchMovies } = useMovies();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home movies={movies} />} />
        <Route path="/movie/:movieName" element={<Moviepage />} />
        <Route path="/showtimes" element={<Showtimes movies={movies} fetchShowSchedule={fetchMovies} />} />
      </Routes>
    </Router>
  );
}

export default App;
