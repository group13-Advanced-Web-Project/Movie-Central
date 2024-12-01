import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./router/userRoute/userRouter.js";
import adminRouter from "./router/adminRouter/adminRouter.js";
import movieRouter from "./router/movieRoute/movieRouter.js";
import reviewsRouter from "./router/reviewsRouter/reviewsRouter.js";
import favoriteRouter from "./router/favoritesRouter/favoritesRouter.js";
import publicProfileRouter from "./router/favoritesRouter/publicProfileRouter.js"; // Added public profile router
import groupRouter from "./router/groupRouter/groupRouter.js";
import { pool } from "./helpers/db.js";

dotenv.config();

const port = 3001;
// const { Pool } = pkg;
// const tmdb_api_key = process.env.TMDB_API_KEY;

const app = express();

app.use(cors());
app.use(express.json());

// Register routers
app.use("/users/", userRouter);
app.use("/admin/", adminRouter);
app.use("/movies/", movieRouter);
app.use("/reviews/", reviewsRouter);
app.use("/favorites/", favoriteRouter);
app.use("/public/", publicProfileRouter); 
app.use("/groups/", groupRouter);


app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Export the app for testing
export default app;

app.listen(port);