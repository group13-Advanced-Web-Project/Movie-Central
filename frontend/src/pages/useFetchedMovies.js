import { useState, useEffect, useRef } from 'react';

// const serverUrl = process.env.REACT_APP_API_URL;
const serverUrl = 'http://localhost:3001';

const useFetchedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchedOnce = useRef(false);  // Add ref to track fetch status  

  useEffect(() => {
    if (fetchedOnce.current) return;  // Skip fetch if already done
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${serverUrl}/movies/fetch-movies`);

        if (!response.ok) {
          throw new Error('Movies not found');
        }

        const data = await response.json();

        setMovies(data);
        fetchedOnce.current = true;  // Update fetch status
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError('Error loading movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, loading, error };
};

export default useFetchedMovies;
