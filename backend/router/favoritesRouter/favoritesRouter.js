import { Router } from 'express';
import { pool } from '../../helpers/db.js';

const router = Router();

router.post('/add', async (req, res) => {
    try {
        const { user_id, fave_1, fave_2, fave_3, fave_4 } = req.body;

        pool.query("INSERT INTO favorites (user_id, fave_1, fave_2, fave_3, fave_4)  VALUES ($1, $2, $3, $4, $5)",
            [user_id, fave_1, fave_2, fave_3, fave_4],
            (error, results) => {
                if (error) {
                    console.error("Database query failed:", error.message);
                    return res.status(500).json({
                        error: "Database query failed",
                        details: error.message,
                    });
                }
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

// Update favorite

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fave_1, fave_2, fave_3, fave_4 } = req.body;
        const parsedId = parseInt(user_id, 10);

        if (isNaN(parsedId)) {
            return res.status(400).json({
                error: "Invalid ID",
                details: "The provided ID is not a valid integer",
            });
        }

        pool.query(
            "UPDATE favorites SET fave_1 = $1, fave_2 = $2, fave_3 = $3, fave_4 = $4 WHERE id = $5",
            [fave_1, fave_2, fave_3, fave_4, parsedId],
            (error, results) => {
                if (error) {
                    console.error("Database query failed:", error.message);
                    return res.status(500).json({
                        error: "Database query failed",
                        details: error.message,
                    });
                }
                res.status(200).json({ message: "Favorites updated successfully" });
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

// Delete favorite

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fave_1, fave_2, fave_3, fave_4 } = req.body;

        let query = "UPDATE favorites SET";
        let updates = [];
        let params = [];
        let index = 1;

        if (fave_1) {
            updates.push(`fave_1 = NULL`);
        }
        if (fave_2) {
            updates.push(`fave_2 = NULL`);
        }
        if (fave_3) {
            updates.push(`fave_3 = NULL`);
        }
        if (fave_4) {
            updates.push(`fave_4 = NULL`);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                error: "No fields to update",
                details: "No favorite fields were provided to delete",
            });
        }

        query += ` ${updates.join(', ')} WHERE id = $${index}`;
        params.push(id);

        pool.query(query, params, (error, results) => {
            if (error) {
                console.error("Database query failed:", error.message);
                return res.status(500).json({
                    error: "Database query failed",
                    details: error.message,
                });
            }
            if (results.rowCount === 0) {
                return res.status(404).json({
                    error: "Favorite entry not found",
                    details: `No favorite entry found with id ${id}`,
                });
            }
            res.status(200).json({ message: "Favorite movies deleted successfully" });
        });
    } catch (error) {
        console.error("Database query failed:", error.message);
        return res.status(500).json({
            error: "Database query failed",
            details: error.message,
        });
    }
});

export default router;