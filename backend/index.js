import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import authRouter from './routers/auth/authRouter.js';
const enviroment = process.env.NODE_ENV;
import userRouter from './routers/userRoute/userRouter.js';
import { pool } from './helpers/db.js';

dotenv.config();





const port = 3001;
const { Pool } = pkg;
const tmdb_api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjQ4NjkxNDc2NTEyMzk3NmVkZmQyMDBhMDNkNTE4ZiIsIm5iZiI6MTczMTMxNzkyNS41ODU3ODI4LCJzdWIiOiI2NzMxYmQ5ZjYxNjI2YWMxMDZiZTY3ZTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.1M1h2M2yeqOEiy5JM46dtKHEDRj_a7y5LLd5308GIbk"

const app = express();
app.use(cors());
app.use('/auth/', authRouter); 
app.use('/users/',userRouter); 


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

        const movies = response.data.results;

        if(!movies || movies.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const formattedMovies = movies.map((movie) => {
            return {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                release_date: movie.release_date
            }
        })
        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie data' });
    }
})
app.get('/users', async (req, res) => { // Create endpoint route
    try {
      const result = await getAll();
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
});
  

const openDb =() => {
    const { Pool } = require('pg');
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.NODE_ENV === 'development' ? 'movie_app_dev' : 'movie_app',
        port: process.env.DB_PORT,
    });
    return pool;
}
  
app.get('/check-db-connection', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ message: 'Database connection successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to the database' });
    }
});

app.listen(port);



