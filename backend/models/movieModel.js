import axios from "axios";
import dotenv from "dotenv";
import pLimit from "p-limit";
import EventEmitter from "events";

dotenv.config();
const tmdb_api_key = process.env.TMDB_API_KEY;
const limit = pLimit(20);
EventEmitter.defaultMaxListeners = 35;

export const fetchMoviesFromEndpoint = async (endpoint, maxPages = 15) => {
    const allMovies = [];
    const promises = [];

    for (let page = 1; page <= maxPages; page++) {
        promises.push(
            limit(() =>
                axios.get(`${endpoint}?api_key=${tmdb_api_key}&page=${page}&region=fi`,
                {
                    headers: {Authorization: `Bearer ${tmdb_api_key}`}
                }).then((response) => {
                    allMovies.push(...response.data.results);
                })
            )
        );
    }
    await Promise.all(promises);
    return allMovies;
}

export const fetchMovieDetails = async (movieId) => {
    try {
        const [detailsResponse, castResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                headers: { Authorization: `Bearer ${tmdb_api_key}` },
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                headers: { Authorization: `Bearer ${tmdb_api_key}` },
            }),
        ]);
        
        return {
            details: detailsResponse.data,
            cast: castResponse.data.cast,
        };
    } catch (error) {
        console.error(`Failed to fetch details for movie ID: ${movieId}`, error.message);
        return null;
    }
};

export const fetchMoviesByQuery = async (query) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_api_key}&query=${encodeURIComponent(query)}`;
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${tmdb_api_key}` } });
    return response.data.results || [];
};
  
export const fetchMoviesByGenre = async (genreId) => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdb_api_key}&with_genres=${genreId}`;
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${tmdb_api_key}` } });
    return response.data.results || [];
};
  
export const fetchMoviesByYear = async (year) => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdb_api_key}&primary_release_year=${year}`;
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${tmdb_api_key}` } });
    return response.data.results || [];
};

export const fetchPopularMovies = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdb_api_key}&region=FI`, {
        headers: { Authorization: `Bearer ${tmdb_api_key}` }
    });
    return response.data.results;
};

export const fetchTrendingMovies = async (pages = 5) => {
    const allMovies = [];
    for (let page = 1; page <= pages; page++) {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week`, {
            params: { api_key: tmdb_api_key, page: page },
            headers: { Authorization: `Bearer ${tmdb_api_key}` },
        });
        allMovies.push(...response.data.results);
    }
    return allMovies;
};