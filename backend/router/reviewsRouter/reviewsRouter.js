import { Router } from "express";
import { pool } from "../../helpers/db.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM review;`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query:", error.message);
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
});

router.post('/', async (req, res) => {
    const { review_id, movie_id, user_id, description, rating, timestamp } = req.body;

    if (!movie_id || !user_id || !description || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO review (review_id, movie_id, user_id, description, rating, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`,
            [review_id, movie_id, user_id, description, rating, timestamp]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error executing query:", error.message);
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
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error executing query:", error.message);
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
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error executing query:", error.message);
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
        console.error("Error executing query:", error.message);
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
        console.error("Error executing query:", error.message);
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
});

export default router;