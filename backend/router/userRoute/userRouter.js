import { Router } from "express";
import { pool } from "../../helpers/db.js";

const router = Router();

router.get("/all", (req, res, next) => {
  try {
    pool.query("SELECT * FROM users", (error, result) => {
      if (error) return next(error); // Pass any query errors to the error handler

      return res.status(200).json(result.rows); // Return all rows as JSON
    });
  } catch (error) {
    return next(error); // Pass any other errors to the error handler
  }
});

router.get("/add", (req, res, next) => {
  try {
    pool.query(
      "INSERT INTO users (auth0_user_id, description) VALUES ; ",
      (error, result) => {
        if (error) return next(error); // Pass any query errors to the error handler

        return res.status(200).json(result.rows); // Return all rows as JSON
      }
    );
  } catch (error) {
    return next(error); // Pass any other errors to the error handler
  }
});

export default router;
