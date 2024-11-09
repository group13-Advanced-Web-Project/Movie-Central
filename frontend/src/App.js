import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.js';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://www.finnkino.fi/xml/Events/');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const events = Array.from(xml.getElementsByTagName('Event')).map((event) => ({
          id: event.getElementsByTagName('ID')[0]?.textContent || 'No ID',
          title: event.getElementsByTagName('Title')[0]?.textContent || 'No Title',
          description: event.getElementsByTagName('ShortSynopsis')[0]?.textContent || 'No Description',
          imageUrl: event.getElementsByTagName('EventLargeImagePortrait')[0]?.textContent || '',
          genres: event.getElementsByTagName('Genres')[0]?.textContent || 'No Genres',
          duration: event.getElementsByTagName('LengthInMinutes')[0]?.textContent || 'Unknown',
          rating: event.getElementsByTagName('Rating')[0]?.textContent || 'No Rating',
          cast: event.getElementsByTagName('Cast')[0]?.textContent || 'No Cast Information',
        }));

        setMovies(events);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home movies={movies} />} />
      </Routes>
    </Router>
  );
}

export default App;
