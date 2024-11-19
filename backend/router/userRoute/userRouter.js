import { Router } from "express";
import { pool } from "../../helpers/db.js";

const router = Router();


router.get("/check-db-connection", async (req, res) => {
  try {
    await pool.query("SELECT * FROM users");
    res.json({ message: "Database connection successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to the database", details: error.message });
  }
});

router.get("/all", (req, res) => {
  try {
    pool.query("SELECT * FROM users", (error, result) => {
      if (error) return (error); // Pass any query errors to the error handler

      return res.status(200).json(result.rows); // Return all rows as JSON
    });
  } catch (error) {
    return (error); // Pass any other errors to the error handler
  }
});

router.post("/check-account", (req, res) => {
  try {
    const { auth0_user_id } = req.body;
    console.log("Received auth0_user_id:", auth0_user_id); // Log received user ID

    // Check if the auth0_user_id exists in the users table by querying the user_id column
    pool.query(
      "SELECT * FROM users WHERE user_id = $1;",
      [auth0_user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error); // Log query error
          return (error); // Pass any query errors to the error handler
        }

        console.log("Query result:", result.rows); // Log query result
        if (result.rows.length > 0) {
          return res.status(200).json(result.rows); // Return all rows as JSON
        } else {
          console.log("User not found"); // Log user not found
          return res.status(404).json({ message: "User not found" }); // Return 404 if no user found
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error); // Log catch error
    return (error); // Pass any other errors to the error handler
  }
});

router.post("/add", (req, res) => {
  try {
    const { auth0_user_id } = req.body;
    pool.query(
      "INSERT INTO users (user_id, role) VALUES ($1, 'user') RETURNING *",
      [auth0_user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error); // Log query error
          return res.status(500).json({ error: error.message }); // Pass any query errors to the error handler
        }

        return res.status(200).json(result.rows); // Return all rows as JSON
      }
    );
  } catch (error) {
    console.error("Catch error:", error); // Log catch error
    return res.status(500).json({ error: error.message }); // Pass any other errors to the error handler
  }
});

router.post("/user-info", (req, res) => {
  try {
    const { auth0_user_id } = req.body;
    console.log("Received auth0_user_id:", auth0_user_id); // Log received user ID

    pool.query(
      "SELECT * FROM users WHERE user_id = $1;",
      [auth0_user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error); // Log query error
          return (error); // Pass any query errors to the error handler
        }

        console.log("Query result:", result.rows); // Log query result
        if (result.rows.length > 0) {
          return res.status(200).json(result.rows); // Return all rows as JSON
        } else {
          console.log("User not found"); // Log user not found
          return res.status(404).json({ message: "User not found" }); // Return 404 if no user found
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error); // Log catch error
    return (error); // Pass any other errors to the error handler
  }
}
);

// removes user account related to the query 
router.post("/remove-account", (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { auth0_user_id } = req.body;
    console.log("Received auth0_user_id:", auth0_user_id); // Log received user ID

    pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *;",
      [auth0_user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error); // Log query error
          return res.status(500).json({ error: error.message }); // Pass any query errors to the error handler
        }

        console.log("Query result:", result.rows); // Log query result
        if (result.rows.length > 0) {
          return res.status(200).json(result.rows); // Return all rows as JSON
        } else {
          console.log("User not found"); // Log user not found
          return res.status(404).json({ message: "User not found" }); // Return 404 if no user found
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error); // Log catch error
    return res.status(500).json({ error: error.message }); // Pass any other errors to the error handler
  }
});

export default router;
