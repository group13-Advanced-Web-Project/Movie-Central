import pkg from "pg";
import dotenv from "dotenv";

const environment = process.env.NODE_ENV;

dotenv.config();
const { Pool } = pkg;

const openDb = () => {
  const pool = new Pool({
    user: 
      process.env.NODE_ENV === "remote"
        ? process.env.DB_USER
        : process.env.REMOTE_DB_USER,
    host:
      process.env.NODE_ENV === "remote"
        ? process.env.DB_HOST
        : process.env.REMOTE_DB_HOST,
    database:
      process.env.NODE_ENV === "remote"
        ? process.env.DB_NAME
        : process.env.REMOTE_DB_NAME,
    password:
      process.env.NODE_ENV === "remote"
        ? process.env.DB_PASSWORD
        : process.env.REMOTE_DB_PASSWORD,
    port: 
      process.env.NODE_ENV === "remote"
        ? process.env.DB_PORT
        : process.env.REMOTE_DB_PORT,
  });
  return pool;
};

const pool = openDb();

export { pool };
