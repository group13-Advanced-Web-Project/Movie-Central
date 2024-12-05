import { Router } from "express";
import {fetchMovies, helloMessage, searchMovies, getMoviesByGenre, getMoviesByYear, getFeaturedMovie, getTrendingMovies} from "../../controllers/movieController.js";

const router = Router();


router.get("/", helloMessage);
router.get("/fetch-movies", fetchMovies);
router.get("/search-movies", searchMovies);
router.get("/movies-by-genre", getMoviesByGenre);
router.get("/movies-by-year", getMoviesByYear);
router.get("/featured-movie", getFeaturedMovie);
router.get("/trending-movies", getTrendingMovies);

export default router;