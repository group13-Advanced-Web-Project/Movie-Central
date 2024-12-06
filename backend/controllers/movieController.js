import { fetchMoviesFromEndpoint, fetchMovieDetails, fetchMoviesByQuery, fetchMoviesByGenre, fetchMoviesByYear, fetchPopularMovies, fetchTrendingMovies } from "../models/movieModel.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const tmdb_api_key = process.env.TMDB_API_KEY;

export const helloMessage = (req, res) => {
    res.json({ message: "Hello from Movie Router!" });
};

export const fetchMovies = async (req, res) => {
    try {
        const nowPlayingMovies = await fetchMoviesFromEndpoint(`https://api.themoviedb.org/3/movie/now_playing`, 2);
        const popularMovies = await fetchMoviesFromEndpoint(`https://api.themoviedb.org/3/movie/popular`, 10);
        const trendingMovies = await fetchMoviesFromEndpoint(`https://api.themoviedb.org/3/trending/movie/week`, 5);

        const movieMap = new Map();
        nowPlayingMovies.forEach((movie) => movieMap.set(movie.id, { ...movie, isNowPlaying: true }));
        [...popularMovies, ...trendingMovies].forEach((movie) => {
            if (!movieMap.has(movie.id)) movieMap.set(movie.id, { ...movie, isNowPlaying: false });
        });

        const combinedMovies = Array.from(movieMap.values()).sort((a, b) => b.popularity - a.popularity);
        
        const filteredMovies = await Promise.all(
            combinedMovies.slice(0, 150).map(async (movie) => {
                const movieDetails = await fetchMovieDetails(movie.id);
                if (movieDetails) {
                    return {
                        id: movie.id,
                        title: movie.title,
                        genres: movieDetails.details.genres.map((genre) => genre.name).join(", "),
                        cast: movieDetails.cast.slice(0, 10).map((actor) => actor.name).join(", "),
                        rating: movieDetails.details.vote_average,
                        overview: movie.overview,
                        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                        release_date: movie.release_date,
                        duration: movieDetails.details.runtime,
                        year: movie.release_date.split("-")[0]
                    };
                }
                return null;
            })
        );

        res.json(filteredMovies.filter((movie) => movie !== null));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchMovies = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }
  
    try {
        const movies = await fetchMoviesByQuery(query);
        if (movies.length === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }
  
        const limitedMovies = movies.slice(0, 10);
  
        const formattedMovies = await Promise.all(
            limitedMovies.map(async (movie) => {
                const { details, cast } = await fetchMovieDetails(movie.id);
                const castNames = cast.slice(0, 10).map((actor) => actor.name).join(", ");
                const genres = details.genres.map((genre) => genre.name).join(", ");
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                    release_date: movie.release_date,
                    genres: genres.length ? genres : "Unknown",
                    rating: details.vote_average,
                    duration: details.runtime,
                    cast: castNames || "Unknown"
                };
            })
        );
        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movie data" });
    }
};

export const getMoviesByGenre = async (req, res) => {
  const { genre } = req.query;
  
  if (!genre) {
    return res.status(400).json({ error: "Genre is required" });
  }

  try {
    const genreResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdb_api_key}`, {
      headers: { Authorization: `Bearer ${tmdb_api_key}` }
    });

    if (!genreResponse.data.genres || genreResponse.data.genres.length === 0) {
      return res.status(404).json({ error: "Failed to retrieve genres" });
    }

    const genreData = genreResponse.data.genres.find((g) => g.name.toLowerCase() === genre.toLowerCase());

    if (!genreData) {
      return res.status(404).json({ error: "Genre not found" });
    }

    const genreId = genreData.id;

    const movieResponse = await fetchMoviesByGenre(genreId);

    if (!movieResponse || movieResponse.length === 0) {
      return res.status(404).json({ error: "Failed to retrieve movies for the given genre" });
    }

    const formattedMovies = await Promise.all(
      movieResponse.map(async (movie) => {
        const { details, cast } = await fetchMovieDetails(movie.id);
        const castNames = cast.slice(0, 10).map((actor) => actor.name).join(", ");
        const genres = details.genres.map((genre) => genre.name).join(", ");
        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          release_date: movie.release_date,
          genres: genres.length ? genres : "Unknown",
          rating: movie.vote_average,
          duration: details.runtime,
          cast: castNames || "Unknown"
        };
      })
    );

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to fetch movies by genre" });
  }
};

  
export const getMoviesByYear = async (req, res) => {
    const { year } = req.query;
    if (!year || isNaN(year) || year.length !== 4) {
        return res.status(400).json({ error: "A valid year is required" });
    }
  
    try {
        const movies = await fetchMoviesByYear(year);
        if (movies.length === 0) {
            return res.status(404).json({ error: "Failed to retrieve movies" });
        }
  
        const formattedMovies = await Promise.all(
            movies.map(async (movie) => {
                const { details, cast } = await fetchMovieDetails(movie.id);
                const castNames = cast.slice(0, 10).map((actor) => actor.name).join(", ");
                const genres = details.genres.map((genre) => genre.name).join(", ");
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                    release_date: movie.release_date,
                    genres: genres.length ? genres : "Unknown",
                    rating: movie.vote_average,
                    duration: details.runtime,
                    cast: castNames || "Unknown"
                };
            })
        );
        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch movies by year" });
    }
};

export const getFeaturedMovie = async (req, res) => {
    try {
        const movies = await fetchPopularMovies();

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: "Featured movie not found" });
        }

        const featuredMovie = movies[Math.floor(Math.random() * movies.length)];

        const { details, cast } = await fetchMovieDetails(featuredMovie.id);

        const genres = details.genres.map((genre) => genre.name).join(", ");
        const castNames = cast.slice(0, 10).map((actor) => actor.name).join(", ");

        const formattedMovie = {
            id: featuredMovie.id,
            title: featuredMovie.title,
            overview: featuredMovie.overview,
            poster_path: featuredMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}`
                : null,
            release_date: featuredMovie.release_date || "Unknown",
            genres: genres || "Unknown",
            rating: featuredMovie.vote_average || "N/A",
            duration: details.runtime || "Unknown",
            cast: castNames || "Unknown"
        };

        res.json(formattedMovie);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch featured movie" });
    }
};

export const getTrendingMovies = async (req, res) => {
    try {
        const allMovies = await fetchTrendingMovies();

        const movieMap = new Map();
        allMovies.forEach((movie) => {
            if (!movieMap.has(movie.id)) {
                movieMap.set(movie.id, movie);
            }
        });

        const sortedMovies = Array.from(movieMap.values()).sort((a, b) => b.popularity - a.popularity);
        const topMovies = sortedMovies.slice(0, 50);

        const formattedMovies = topMovies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null
        }));

        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch trending movies" });
    }
};