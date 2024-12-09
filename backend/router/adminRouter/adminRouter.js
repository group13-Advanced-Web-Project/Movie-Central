import { Router } from "express";
import { pool } from "../../helpers/db.js";

const router = Router();

router.get("/check-db-connection", async (req, res) => {
    try {
      await pool.query("SELECT * FROM review");
      res.json({ message: "Database connection successful" });
    } catch (error) {
      res.status(500).json({ error: "Failed to connect to the database", details: error.message });
    }
  });

router.post("/authenticate", async (req, res) => {
    try {
        const { auth0_user_id } = req.body;
        console.log("Request received at /authenticate with body:", req.body);
        console.log("Authenticating user with ID:", auth0_user_id);
        pool.query(
            "SELECT * FROM reviews WHERE user_id = $1;",
            [auth0_user_id],

            (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Database query failed", details: error.message });
                }
                if (results.rows.length === 0) {
                    return res.status(404).json({ error: "User not found" });
                }
                const user = results.rows[0];
                if (user.role === 'admin') {
                    return res.status(200).json({ message: "User is an admin" });
                } else {
                    return res.status(404).json({ error: "User is not an admin" });
                }
            }
        );
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});


router.post("/query", async (req, res) => {
    try {
        const { query, params } = req.body;

        console.log("Admin Query Execution:");
        console.log("Query:", query);
        console.log("Params:", params);

        pool.query(query, params || [], (error, results) => {
            if (error) {
                console.error("Database query failed:", error.message);
                return res.status(500).json({
                    error: "Database query failed",
                    details: error.message,
                });
            }

            // Send results back to the frontend
            res.status(200).json({
                success: true,
                data: results.rows,
            });
        });
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Server error",
            details: error.message,
        });
    }
});


router.get("/users", async (req, res) => {
    try {
        pool.query("SELECT * FROM users", (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed", details: error.message });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});
router.get("/favorites", async (req, res) => {
    try {
        pool.query("SELECT * FROM favorites", (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed", details: error.message });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});
router.get("/movie", async (req, res) => {
    try {
        pool.query("SELECT * FROM movie", (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed", details: error.message });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});
router.get("/review", async (req, res) => {
    try {
        pool.query("SELECT * FROM review", (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed", details: error.message });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});
router.get("/groups", async (req, res) => {
    try {
        pool.query("SELECT * FROM groups", (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed", details: error.message });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.get("/group_members", async (req, res) => {
    try {
        pool.query("SELECT * FROM group_members", (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Database query failed", details: error.message });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default router;

