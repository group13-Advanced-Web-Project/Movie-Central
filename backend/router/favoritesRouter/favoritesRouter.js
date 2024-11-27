import { Router } from 'express';
import { pool } from '../../helpers/db.js';

const router = Router();

// Add a favorite movie
router.post('/', async (req, res) => {
    try {
        const { user_id, movie_id } = req.body;

        if (!user_id || !movie_id) {
            return res.status(400).json({ error: "User ID and Movie ID are required" });
        }

        const insertQuery = "INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
        await pool.query(insertQuery, [user_id, movie_id]);

        return res.status(200).json({ message: "Favorite added successfully" });
    } catch (error) {
        console.error("Error in /favorites route:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Remove a favorite movie
router.delete('/', async (req, res) => {
    try {
        const { user_id, movie_id } = req.body;

        if (!user_id || !movie_id) {
            return res.status(400).json({ error: "User ID and Movie ID are required" });
        }

        // Check if the favorite movie exists
        const checkQuery = "SELECT * FROM favorites WHERE user_id = $1 AND movie_id = $2";
        const checkResult = await pool.query(checkQuery, [user_id, movie_id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Favorite movie not found" });
        }

        // Delete the favorite movie
        const deleteQuery = "DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2";
        await pool.query(deleteQuery, [user_id, movie_id]);

        return res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
        console.error("Error in /favorites route:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});


// Get all favorite movies for a user
router.get('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const query = "SELECT movie_id FROM favorites WHERE user_id = $1";
        const result = await pool.query(query, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No favorite movies found for this user" });
        }

        res.status(200).json(result.rows.map(row => row.movie_id));
    } catch (error) {
        console.error("Error fetching favorite movies:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default router;