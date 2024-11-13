import express from 'express';
import cors from 'cors';
import axios from 'axios';

import xml2js from 'xml2js';

import dotenv from 'dotenv';
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import authRouter from './routers/auth/authRouter.js';


dotenv.config();



const port = 3001;
const tmdb_api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjQ4NjkxNDc2NTEyMzk3NmVkZmQyMDBhMDNkNTE4ZiIsIm5iZiI6MTczMTMxNzkyNS41ODU3ODI4LCJzdWIiOiI2NzMxYmQ5ZjYxNjI2YWMxMDZiZTY3ZTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.1M1h2M2yeqOEiy5JM46dtKHEDRj_a7y5LLd5308GIbk"
const schedule_url = "https://www.finnkino.fi/xml/Schedule"

const app = express();
app.use(cors());
app.use('/auth/', authRouter); ;

const getShowtimes = async (movieTitle) => {
    try {
        const response = await axios.get(schedule_url);
        console.log("API response: ", response.data);

        if(response.data.status === "OK") {
            const xmlData = response.data;
            console.log("Fetched XML Data:", xmlData);

            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(xmlData);
            console.log("Parsed XML Result:", result);

            const shows = result.Schedule.Shows[0].Show || [];

            const filteredShows = shows.filter((show) => {
                const title = show.Title?.[0]?.toLowerCase() || '';
                return title.includes(movieTitle.toLowerCase());
            })

            const showtimes = filteredShows.map((show) => ({
                title: show.Title[0],
                start_time: show.dttmShowStart[0],
                end_time: show.dttmShowEnd[0],
                theater: `${show.Theatre[0]} - ${show.TheatreAuditorium[0]}`,
            }))

            return showtimes;
        } else {
            console.error("Error: Status not OK", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching showtimes: ",error);
        return [];
    }
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
})

app.get('/search-movies', async(req,res) => {
    const { query } = req.query;

    if(!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_api_key}&query=${encodeURIComponent(query)}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${tmdb_api_key}`
            }
        });

        const movies = response.data.results || [];

        if(!movies || movies.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const formattedMovies = await Promise.all(movies.map(async (movie) => {
            const showtimes = await getShowtimes(movie.title);
            return {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                release_date: movie.release_date,
                showtimes: showtimes
            }
        }))
        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie data' });
    }
})


  

app.listen(port);