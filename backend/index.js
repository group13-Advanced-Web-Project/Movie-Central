import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./router/userRoute/userRouter.js";
import movieRouter from "./router/movieRoute/movieRouter.js";
import { pool } from "./helpers/db.js";

dotenv.config();

const port = 3001;
// const { Pool } = pkg;
// const tmdb_api_key = process.env.TMDB_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users/", userRouter);
app.use("/movies/", movieRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(port);