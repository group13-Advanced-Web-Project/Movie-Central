// functionality required to test:
// user creation is through auth0, this is the user table:
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   user_id VARCHAR(255) UNIQUE NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   role VARCHAR(255) NOT NULL
// );

// Sign in   /user/check-account
// Sign out  auth0
// Sign up   /users/add
// Deleting account   /user/remove-account
// Browsing reviews /reviews/

import request from "supertest";
import app from "../index.js"; // Ensure this is the correct path to your app
import { pool } from "../helpers/db.js";

describe("User Endpoints (Live Production Database)", () => {
  let server;

  // Server connection check before running tests
  beforeAll(async () => {
    let serverAwake = false;
    // console.log("Server is not awake. Retrying in 5 seconds...");

    // Retry every 5 seconds until the server responds
    while (!serverAwake) {
      try {
        const response = await request(app).get("/users/check-db-connection");
        // console.log("Server status code response:", response.status);

        if (response.status === 200) {
          serverAwake = true;
          // console.log("Server is awake, db connection success.");
        }
      } catch (error) {
        // console.log("Error during server ping:", error.message);
        console.log("Server is not awake. Retrying in 5 seconds...");
      }

      if (!serverAwake) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      }
    }

    // Initialize server
    server = app.listen(4000, () => {
      // console.log("Test server is running on port 4000");
    });
  }, 60000); // Increase the timeout to 60 seconds for `beforeAll` hook

  // Ensure async cleanup after all tests
  afterAll(async () => {
    console.log("Cleaning up after tests...");
  
    // Close the database pool
    await pool.end();
    console.log("Database pool closed.");
  
    // Explicitly close the server if it's running
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err); // Reject if there's an error closing the server
          } else {
            console.log("Server closed.");
            resolve();
          }
        });
      });
    } else {
      console.log("Server was not running.");
    }
  });
  
  

  describe("POST /users/add", () => {
    const testUser = {
      auth0_user_id: "test-auth0-id",
      email: "test@example.com",
    };

    // Cleanup after each test
    afterEach(async () => {
      // console.log("Cleaning up user data...");
      await pool.query("DELETE FROM users WHERE user_id = $1", [
        testUser.auth0_user_id,
      ]);
      // console.log(`User with ID ${testUser.auth0_user_id} deleted.`);
    });

    // Test case for successfully creating a new user
    it("should create a new user and return 200, then delete the user", async () => {
      // console.log("Starting test: should create a new user");

      const response = await request(app).post("/users/add").send(testUser);

      // console.log("Test response:", response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body[0]).toMatchObject({
        user_id: testUser.auth0_user_id,
        email: testUser.email,
        role: "user",
      });
      // console.log("Test passed: User created.");
    });

    // Test case for missing required fields (auth0_user_id and email)
    it("should return 400 if required fields are missing", async () => {
      // console.log("Starting test: should return 400 if required fields are missing");

      const response = await request(app)
        .post("/users/add")
        .send({ email: "test@example.com" }); // Missing auth0_user_id

      // console.log("Test response:", response.status, response.body);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "auth0_user_id and email are required.",
      });
      // console.log("Test passed: Missing fields correctly handled.");
    });

    // Test case for when the user already exists
    it("should return 409 if the user already exists", async () => {
      // console.log("Starting test: should return 409 if the user already exists");

      const existingUser = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [testUser.auth0_user_id]
      );
      if (existingUser.rows.length === 0) {
        // console.log("User not found, adding the user first.");
        await pool.query(
          "INSERT INTO users (user_id, email, role) VALUES ($1, $2, 'user')",
          [testUser.auth0_user_id, testUser.email]
        );
      }

      const response = await request(app).post("/users/add").send(testUser);

      // console.log("Test response:", response.status, response.body);

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("User already exists.");
      // console.log("Test passed: Duplicate user correctly handled.");
    });
  });

  describe("POST /users/check-account", () => {
    const testUser = {
      auth0_user_id: "test-auth0-id",
      email: "test@example.com",
    };

    // Setup before each test
    beforeEach(async () => {
      // console.log("Setting up test user...");
      await pool.query(
        "INSERT INTO users (user_id, email, role) VALUES ($1, $2, 'user')",
        [testUser.auth0_user_id, testUser.email]
      );
      // console.log("Test user created.");
    });

    // Cleanup after each test
    afterEach(async () => {
      // console.log("Cleaning up user data...");
      await pool.query("DELETE FROM users WHERE user_id = $1", [
        testUser.auth0_user_id,
      ]);
      // console.log(`User with ID ${testUser.auth0_user_id} deleted.`);
    });

    // Test case for successfully checking an existing user
    it("should return 200 if the user exists", async () => {
      // console.log("Starting test: should return 200 if the user exists");

      const response = await request(app)
        .post("/users/check-account")
        .send({ auth0_user_id: testUser.auth0_user_id });

      // console.log("Test response:", response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body[0]).toMatchObject({
        user_id: testUser.auth0_user_id,
        email: testUser.email,
        role: "user",
      });
      // console.log("Test passed: User found.");
    });

    // Test case for when the user does not exist
    it("should return 404 if the user does not exist", async () => {
      // console.log("Starting test: should return 404 if the user does not exist");

      const response = await request(app)
        .post("/users/check-account")
        .send({ auth0_user_id: "non-existent-id" });

      // console.log("Test response:", response.status, response.body);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("User not found");
      // console.log("Test passed: User not found.");
    });

    // Test case for missing required fields (auth0_user_id)
    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/users/check-account")
        .send({ email: "badtest@example.com" }); // Missing auth0_user_id
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("auth0_user_id is required");
    });
  });

  describe("GET /users/all", () => {
    // Test case for successfully fetching all users
    it("should return 200 and all users", async () => {
      // console.log("Starting test: should return 200 and all users");

      const response = await request(app).get("/users/all");

      // console.log("Test response:", response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      // console.log("Test passed: Users fetched.");
    });
  });

  describe("POST /users/remove-account", () => {
    const testUser = {
      auth0_user_id: "test-auth0-id",
      email: "test@example.com",
    };

    // Setup before each test
    beforeEach(async () => {
      await pool.query(
        "INSERT INTO users (user_id, email, role) VALUES ($1, $2, 'user')",
        [testUser.auth0_user_id, testUser.email]
      );
    });

    // Cleanup after each test
    afterEach(async () => {
      await pool.query("DELETE FROM users WHERE user_id = $1", [
        testUser.auth0_user_id,
      ]);
    });

    // Test case for successfully deleting an existing user
    it("should return 200 if the user is deleted", async () => {
      const response = await request(app)
        .post("/users/remove-account")
        .send({ auth0_user_id: testUser.auth0_user_id });

      expect(response.status).toBe(200);
      expect(response.body[0]).toMatchObject({
        user_id: testUser.auth0_user_id,
        email: testUser.email,
        role: "user",
      });
    });

    // Test case for when the user does not exist
    it("should return 404 if the user does not exist", async () => {
      const response = await request(app)
        .post("/users/remove-account")
        .send({ auth0_user_id: "non-existent-id" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    // Test case for missing required fields (auth0_user_id)
    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/users/remove-account")
        .send({ email: "non-existent-id" }); // Missing auth0_user_id

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("auth0_user_id is required.");
    });
  });

  describe("GET /reviews/", () => {
    // Test case for successfully fetching all reviews
    it("should return 200 and all reviews", async () => {
      const response = await request(app).get("/reviews/");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});
