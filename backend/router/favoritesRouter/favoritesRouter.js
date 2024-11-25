import { Router } from 'express';
import { pool } from '../../helpers/db.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { user_id, movieId } = req.body;

        // Check if the user already has a favorite
        const checkQuery = "SELECT * FROM favorites WHERE user_id = $1";
        const values = [user_id];

        pool.query(checkQuery, values, (checkError, checkResult) => {
            if (checkError) {
                console.error("Error checking favorites:", checkError.message);
                return res.status(500).json({
                    error: "Database query failed",
                    details: checkError.message,
                });
            }

            if (checkResult.rows.length > 0) {
                // If a favorite already exists for the user, update it
                const updateQuery = "UPDATE favorites SET fave_1 = $2 WHERE user_id = $1";
                pool.query(updateQuery, [user_id, movieId], (updateError) => {
                    if (updateError) {
                        console.error("Error updating favorite:", updateError.message);
                        return res.status(500).json({
                            error: "Database query failed",
                            details: updateError.message,
                        });
                    }
                    return res.status(200).json({ message: "Favorite updated successfully" });
                });
            } else {
                // If no favorite exists, insert a new row
                const insertQuery = "INSERT INTO favorites (user_id, fave_1) VALUES ($1, $2)";
                pool.query(insertQuery, [user_id, movieId], (insertError) => {
                    if (insertError) {
                        console.error("Error inserting favorite:", insertError.message);
                        return res.status(500).json({
                            error: "Database query failed",
                            details: insertError.message,
                        });
                    }
                    return res.status(200).json({ message: "Favorite added successfully" });
                });
            }
        });

    } catch (error) {
        console.error("Error in /favorites route:", error.message);
        return res.status(500).json({
            error: "Server error",
            details: error.message,
        });
    }
});



router.post('/all', async (req, res) => {
    try {
        const { user_id } = req.body; 

        if (!user_id) {
            return res.status(400).json({
                error: "User ID is required",
            });
        }

        console.log("Fetching favorite movies for user_id:", user_id);

        const query = "SELECT fave_1 FROM favorites WHERE user_id = $1 AND fave_1 IS NOT NULL AND fave_1 != ''";
        const values = [user_id];

        try {
            // Using async/await for the query
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "No favorite movies found for this user",
                });
            }

            // If data exists, return the list of fave_1 values
            res.status(200).json(result.rows.map(row => row.fave_1));
            console.log("Favorites fetched successfully", result.rows);
        } catch (dbError) {
            console.error("Database query failed:", dbError.message);
            return res.status(500).json({
                error: "Database query failed",
                details: dbError.message,
            });
        }
    } catch (error) {
        console.error("Error in /favorites/all route:", error.message);
        return res.status(500).json({
            error: "Server error",
            details: error.message,
        });
    }
});



//Remove favorite

router.delete('/', async (req, res) => {
    try {
        const { user_id } = req.body;
       
        pool.query(
            "DELETE FROM favorites WHERE user_id = $1",
            [user_id],
            (error) => {
                if (error) {
                    console.error("Database query failed:", error.message);
                    return res.status(500).json({
                        error: "Database query failed",
                        details: error.message,
                    });
                }
                res.status(200).json({ message: "Favorites removed successfully" });
            }
        );
    } catch (error) {
        console.error("Database query failed:", error.message);
        return res.status(500).json({
            error: "Database query failed",
            details: error.message,
        });
    }
});


export default router;