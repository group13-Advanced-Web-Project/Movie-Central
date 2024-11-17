import { useState, useEffect, useRef } from 'react';

const useFetchedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchedOnce = useRef(false);  // Add ref to track fetch status  

  useEffect(() => {
    if (fetchedOnce.current) return;  // Skip fetch if already done
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
          year: event.getElementsByTagName('ProductionYear')[0]?.textContent || 'Unknown',
        }));

        setMovies(events);
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
