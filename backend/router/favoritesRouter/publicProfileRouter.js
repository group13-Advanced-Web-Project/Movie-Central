import { Router } from "express";
import { pool } from "../../helpers/db.js";

const publicProfileRouter = Router();

publicProfileRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        // Fetch user details
        const userQuery = "SELECT user_id, email,nickname, role FROM users WHERE id = $1";
        const userResult = await pool.query(userQuery, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userResult.rows[0];

        // Fetch favorite movies
        const favoritesQuery = "SELECT movie_id FROM favorites WHERE user_id = $1";
        const favoritesResult = await pool.query(favoritesQuery, [userData.user_id]);

        const favoriteMovies = favoritesResult.rows.map((row) => row.movie_id);

        // Combine user data and favorite movies
        const result = {
            user: userData,
            favorites: favoriteMovies,
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching public profile:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default publicProfileRouter;
