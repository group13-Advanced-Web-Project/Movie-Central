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

    // Validate if the required field is missing
    if (!auth0_user_id) {
      return res.status(400).json({ message: "auth0_user_id is required" });
    }

    // Check if the auth0_user_id exists in the users table by querying the user_id column
    pool.query(
      "SELECT * FROM users WHERE user_id = $1;",
      [auth0_user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error); // Log query error
          return res.status(500).json({ message: "Database query failed" }); // Return 500 for server error
        }

        if (result.rows.length > 0) {
          return res.status(200).json(result.rows); // Return all rows as JSON
        } else {
          return res.status(404).json({ message: "User not found" }); // Return 404 if no user found
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error); // Log catch error
    return res.status(500).json({ message: "Server error" }); // Return 500 for unexpected errors
  }
});


router.post("/add", (req, res) => {
  try {
    const { auth0_user_id, email } = req.body; // Destructure email and auth0_user_id from the request body

    // Ensure both auth0_user_id and email are provided
    if (!auth0_user_id || !email) {
      return res.status(400).json({ error: "auth0_user_id and email are required." });
    }

    pool.query(
      "INSERT INTO users (user_id, email, role) VALUES ($1, $2, 'user') RETURNING *",
      [auth0_user_id, email],
      (error, result) => {
        if (error) {
          // Check for unique constraint violation error code
          if (error.code === '23505') { // Duplicate key violation
            return res.status(409).json({ error: "User already exists." });
          }

          // Log any other query errors
          console.error("Query error:", error);
          return res.status(500).json({ error: error.message });
        }

        // Successfully inserted, return the inserted row
        return res.status(200).json(result.rows);
      }
    );
  } catch (error) {
    // Log unexpected errors
    console.error("Catch error:", error);
    return res.status(500).json({ error: error.message });
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

    // Check if auth0_user_id is missing
    if (!auth0_user_id) {
      console.log("auth0_user_id is required.");
      return res.status(400).json({ error: "auth0_user_id is required." });
    }

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

// Update user nickname
router.put("/update-nickname", (req, res) => {
  try {
    const { auth0_user_id, nickname } = req.body;

    if (!auth0_user_id || !nickname) {
      return res.status(400).json({ error: "auth0_user_id and nickname are required." });
    }

    pool.query(
      "UPDATE users SET nickname = $1 WHERE user_id = $2 RETURNING *;",
      [nickname, auth0_user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error);
          return res.status(500).json({ error: error.message });
        }

        if (result.rows.length > 0) {
          return res.status(200).json(result.rows);
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Fetch all shareable_urls from the users table
router.get("/shareable-urls", (req, res) => {
  try {
    pool.query(
      "SELECT user_id, nickname, shareable_url FROM users WHERE user_id != 'Deleted User';",
      (error, result) => {
        if (error) {
          console.error("Query error:", error);
          return res.status(500).json({ error: error.message });
        }

        if (result.rows.length > 0) {
          return res.status(200).json(result.rows);
        } else {
          return res.status(404).json({ message: "No shareable URLs found" });
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Generate a shareable URL for a user
router.post("/generate-shareable-url", (req, res) => {
  try {
    const { user_id } = req.body;

    pool.query(
      `UPDATE users 
      SET shareable_url = CONCAT('https://movie-app-group13.netlify.app/public/', id)
      WHERE user_id = $1 
      RETURNING shareable_url;`,
      [user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error);
          return res.status(500).json({ error: error.message });
        }

        if (result.rows.length > 0) {
          return res.status(200).json(result.rows);
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Fetch shareable_url for a specific user
router.get("/:user_id/shareable-url", (req, res) => {
  try {
    const { user_id } = req.params;

    pool.query(
      "SELECT user_id, nickname, shareable_url FROM users WHERE user_id = $1;",
      [user_id],
      (error, result) => {
        if (error) {
          console.error("Query error:", error);
          return res.status(500).json({ error: error.message });
        }

        if (result.rows.length > 0) {
          return res.status(200).json(result.rows);
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      }
    );
  } catch (error) {
    console.error("Catch error:", error);
    return res.status(500).json({ error: error.message });
  }
});


export default router;
