import { createContext, useContext } from 'react';
import useFetchedMovies from '../pages/useFetchedMovies';

const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
  const { movies, loading, error } = useFetchedMovies();
  return (
    <MoviesContext.Provider value={{ movies, loading, error }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => useContext(MoviesContext);
