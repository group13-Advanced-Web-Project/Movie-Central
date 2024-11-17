import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { Router } from "express";
import { pool } from "../../helpers/db.js";

dotenv.config();

const router = Router();
const tmdb_api_key = process.env.TMDB_API_KEY;

router.get("/", (req, res) => {
    res.json({ message: "Hello from Movie Router!" });
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
  
      const genreResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdb_api_key}`,
      {
        headers: {
          Authorization: `Bearer ${tmdb_api_key}`
        }
      });
  
      const genreMap = Object.fromEntries(
        genreResponse.data.genres.map((genre) => [genre.id, genre.name])
      );
  
      const formattedMovies = await Promise.all(
        movies.map(async (movie) => {
          const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown");

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
  
          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            release_date: movie.release_date,
            genres: genreNames,
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

export default router;

