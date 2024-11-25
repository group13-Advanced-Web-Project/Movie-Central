import { Router } from "express";
import { pool } from "../../helpers/db.js";
import axios from "axios";

const router = Router();
const tmdb_api_key = process.env.TMDB_API_KEY;

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM review;`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
});

router.post('/', async (req, res) => {
    const { movie_id, user_id, description, rating, user_email } = req.body;

    if (!movie_id || !user_id || !description || !rating || !user_email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingReview = await pool.query(
            `SELECT * FROM review
            WHERE movie_id = $1 AND user_id = $2;`,
            [movie_id, user_id]
        );
        
        if (existingReview.rows.length > 0) {
            return res.status(400).json({ error: "User has already given a review to this movie" });
        }

        let movie_name = "Unknown";
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${tmdb_api_key}`,
            {
                headers: {
                    Authorization: `Bearer ${tmdb_api_key}`
                }
            });
            if (response.data && response.data.title) {
                movie_name = response.data.title;
            }
        } catch (error) {
            console.error("Failed to fetch movie data: ", error.message);
        }

        const result = await pool.query(
            `INSERT INTO review (movie_id, movie_name, user_id, user_email, description, rating)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`,
            [movie_id, movie_name, user_id, user_email, description, rating]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to add review", details: error.message });
    }
});

router.delete('/:review_id', async (req, res) => {
    const { review_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM review
            WHERE review_id = $1
            RETURNING *;`,
            [review_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review", details: error.message });
    }
});

// Update a review
router.put('/:review_id', async (req, res) => {
    const { review_id } = req.params;
    const { description, rating } = req.body;

    if (!description && !rating) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await pool.query(
            `UPDATE review
            SET description = COALESCE($1, description),
                rating = COALESCE($2, rating)
            WHERE review_id = $3
            RETURNING *;`,
            [description, rating, review_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to update review", details: error.message });
    }
});

// Get reviews by movie_id
router.get('/movie/:movie_id', async (req, res) => {
    const { movie_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM review
            WHERE movie_id = $1;`,
            [movie_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
});

// Get reviews by user_id
router.get('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM review
            WHERE user_id = $1;`,
            [user_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
});

export default router;