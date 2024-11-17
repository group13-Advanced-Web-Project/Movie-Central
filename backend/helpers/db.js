import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
const { Pool } = pkg;

const openDb = () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false, // Enable SSL with self-signed certificates
    },
  });
  return pool;
};

const pool = openDb();

export { pool };
