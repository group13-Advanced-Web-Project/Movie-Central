import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { Router } from "express";
import { pool } from "../../helpers/db.js";
import EventEmitter from "events";
import pLimit from "p-limit";

EventEmitter.defaultMaxListeners = 20;
const limit = pLimit(50);

dotenv.config();

const router = Router();
const tmdb_api_key = process.env.TMDB_API_KEY;

router.get("/", (req, res) => {
    res.json({ message: "Hello from Movie Router!" });
});


router.get("/fetch-movies", async (req, res) => {
    const allMovies = [];
    let currentPage = 1;
    const maxPages = 5;
    let hasError = false;

    try {
        while (currentPage <= maxPages) {
            const response = await limit(() =>
                axios.get(
                    `https://api.themoviedb.org/3/movie/popular?page=${currentPage}`,
                    { headers: { Authorization: `Bearer ${tmdb_api_key}` } }
                )
            );

            const movies = response.data.results;
            allMovies.push(...movies);
            currentPage++;
        }

        const movies = await Promise.all(
            allMovies.map(async (movie) => {
                try {
                    const [detailsResponse, castResponse] = await Promise.all([
                        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                            headers: { Authorization: `Bearer ${tmdb_api_key}` },
                        }),
                        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
                            headers: { Authorization: `Bearer ${tmdb_api_key}` },
                        })
                    ]);

                    const genres = detailsResponse.data.genres.map((genre) => genre.name).join(", ");
                    const duration = detailsResponse.data.runtime || "Unknown";
                    const cast = castResponse.data.cast.slice(0, 10).map((actor) => actor.name).join(", ");

                    return {
                        id: movie.id,
                        title: movie.title,
                        overview: movie.overview,
                        poster_path: movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : null,
                        release_date: movie.release_date || "Unknown",
                        genres: genres || "Unknown",
                        rating: movie.vote_average || "N/A",
                        duration: duration,
                        cast: cast || "Unknown",
                        year: movie.release_date ? movie.release_date.split("-")[0] : "Unknown",
                    };
                } catch (error) {
                    hasError = true;
                    console.error("Error fetching movie details:", error.message);
                    return null;
                }
            })
        );

        if (hasError) {
            return res.status(500).json({ error: "Failed to fetch movies" });
        }

        const filteredMovies = movies.filter((movie) => movie !== null);
        res.json(filteredMovies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ error: error.message || "Failed to fetch movies" });
    }
});

router.get("/search-movies", async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
  
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_api_key}&query=${encodeURIComponent(
        query
      )}`;
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${tmdb_api_key}`,
        },
      });
  
      const movies = response.data.results || [];
  
      if (!movies || movies.length === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }

      const limitedMovies = movies.slice(0, 10);
  
      const formattedMovies = await Promise.all(
        limitedMovies.map(async (movie) => {

          const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdb_api_key}`,
          {
            headers: {
              Authorization: `Bearer ${tmdb_api_key}`
            }
          });

          const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${tmdb_api_key}`,
            {
                headers: {
                Authorization: `Bearer ${tmdb_api_key}`
                }
            });

            const cast = castResponse.data.cast.slice(0,10).map((actor) => actor.name).join(", ");
            const genres = detailsResponse.data.genres.map((genre) => genre.name).join(", ");
  
          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            release_date: movie.release_date,
            genres: genres.length ? genres : "Unknown",
            rating: detailsResponse.data.vote_average,
            duration: detailsResponse.data.runtime,
            cast: cast
          };
        })
      );
      res.json(formattedMovies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movie data" });
    }
});

router.get("/movies-by-genre", async (req, res) => {
    const { genre } = req.query;

    if (!genre) {
        return res.status(400).json({ error: "Genre is required" });
    }

    try {
        const genreResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdb_api_key}`,
        {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        if (!genreResponse.data.genres) {
            return res.status(404).json({ error: "Failed to retrieve genres" });
        }

        const genreList = genreResponse.data.genres;
        const genreData = genreList.find((g) => g.name.toLowerCase() === genre.toLowerCase());

        if (!genreData) {
            return res.status(404).json({ error: "Genre not found" });
        }

        const genreId = genreData.id;

        const movieResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdb_api_key}&with_genres=${genreId}`,
        {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        if (!movieResponse.data.results) {
            return res.status(404).json({ error: "Failed to retrieve movies" });
        }

        const movies = await Promise.all(
            movieResponse.data.results.map(async (movie) => {
                const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdb_api_key}`,
                {
                headers: {
                    Authorization: `Bearer ${tmdb_api_key}`
                }
                });
    
                const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${tmdb_api_key}`,
                {
                    headers: {
                    Authorization: `Bearer ${tmdb_api_key}`
                    }
                });
                
                const genres = detailsResponse.data.genres.map((genre) => genre.name).join(", ");
                const duration = detailsResponse.data.runtime;
                const cast = castResponse.data.cast.slice(0,10).map((actor) => actor.name).join(", ");
        
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null,
                    release_date: movie.release_date,
                    genres: genres.length ? genres : "Unknown",
                    rating: movie.vote_average,
                    duration: duration,
                    cast: cast || "Unknown"
                };
            })
        );
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch movies by genre" });
    }
});

router.get("/movies-by-year", async (req, res) => {
    const { year } = req.query;

    if (!year || isNaN(year) || year.length !== 4) {
        return res.status(400).json({ error: "A valid year is required" });
    }

    try {
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdb_api_key}&primary_release_year=${year}`,
        {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        if (!movieResponse.data.results) {
            return res.status(404).json({ error: "Failed to retrieve movies" });
        }

        const movies = await Promise.all(
            movieResponse.data.results.map(async (movie) => {
                const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdb_api_key}`,
                {
                headers: {
                    Authorization: `Bearer ${tmdb_api_key}`
                }
                });
    
                const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${tmdb_api_key}`,
                {
                    headers: {
                    Authorization: `Bearer ${tmdb_api_key}`
                    }
                });
                
                const genres = detailsResponse.data.genres.map((genre) => genre.name).join(", ");
                const duration = detailsResponse.data.runtime;
                const cast = castResponse.data.cast.slice(0,10).map((actor) => actor.name).join(", ");
        
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null,
                    release_date: movie.release_date,
                    genres: genres.length ? genres : "Unknown",
                    rating: movie.vote_average,
                    duration: duration,
                    cast: cast || "Unknown"
                };
            })
        );
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch movies by year" });
    }
})

router.get("/featured-movie", async (req, res) => {
    try {
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdb_api_key}`,
        {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        const movies = movieResponse.data.results;

        if(!movies || movies.length === 0) {
            return res.status(404).json({ error: "Featured movie not found" });
        }

        const featuredMovie = movies[Math.floor(Math.random() * movies.length)];

        const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${featuredMovie.id}?api_key=${tmdb_api_key}`,
        {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${featuredMovie.id}/credits?api_key=${tmdb_api_key}`,
        {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        const genres = detailsResponse.data.genres.map((genre) => genre.name).join(", ");
        const cast = castResponse.data.cast.slice(0,10).map((actor) => actor.name).join(", ");

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
            duration: detailsResponse.data.runtime || "Unknown",
            cast: cast || "Unknown"
        }
        res.json(formattedMovie);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch featured movie" });
    }
})

router.get("/trending-movies", async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdb_api_key}`,
        {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        const movies = response.data.results;

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: "Trending movies not found" });
        }

        const formattedMovies = await Promise.all(
            movies.map(async (movie) => {
                const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdb_api_key}`,
                {
                    headers: {
                        Authorization: `Bearer ${tmdb_api_key}`
                    }
                });

                const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${tmdb_api_key}`,
                {
                    headers: {
                        Authorization: `Bearer ${tmdb_api_key}`
                    }
                });

                const genres = detailsResponse.data.genres.map((genre) => genre.name).join(", ");
                const duration = detailsResponse.data.runtime;
                const cast = castResponse.data.cast.slice(0,10).map((actor) => actor.name).join(", ");

                return {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null
                };
            })
        );
        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch trending movies" });
    }
})

export default router;

