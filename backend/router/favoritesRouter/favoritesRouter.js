import { Router } from 'express';
import { pool } from '../../helpers/db.js';

const router = Router();

router.post ('/add', async (req, res) => {
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