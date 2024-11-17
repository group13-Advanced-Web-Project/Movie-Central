import { useState, useEffect } from 'react';
import { fetchShowSchedule } from './fetchShowSchedule'; 

const useMovies = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async (date, areaCode = '') => {
    const shows = await fetchShowSchedule(date, areaCode);
    setMovies(shows);
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchMovies(today);
  }, []);

  return { movies, fetchMovies };
};

export default useMovies;
