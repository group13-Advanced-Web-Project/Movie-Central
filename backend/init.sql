DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS groups;


--------------------------------------------CREATE TABLES--------------------------------------------
--------------------------------------------CREATE TABLES--------------------------------------------
--------------------------------------------CREATE TABLES--------------------------------------------
-- Create users table
CREATE TABLE users ( 
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL
);

-- Create favorites table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    fave_1 VARCHAR(255),
    fave_2 VARCHAR(255),
    fave_3 VARCHAR(255),
    fave_4 VARCHAR(255)
);

-- Create review table
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    movie_id VARCHAR(255) NOT NULL,
    movie_name VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) DEFAULT 'Deleted User',
    user_email VARCHAR(255) DEFAULT 'Deleted User',
    description TEXT,
    rating INT,
    timestamp VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET DEFAULT,
    CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users (email) ON DELETE SET DEFAULT,
    CONSTRAINT unique_review UNIQUE (movie_id, user_id)
);

-- Create groups table
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    -- admin VARCHAR(255) NOT NULL,
    -- FOREIGN KEY (admin) REFERENCES users (user_id) ON DELETE CASCADE
);

-- Create group members table
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    status VARCHAR(255) DEFAULT 'pending',
    FOREIGN KEY (group_id) REFERENCES groups (group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT unique_member UNIQUE (group_id, user_id),
    CONSTRAINT one_admin_per_group UNIQUE (group_id, is_admin) WHERE is_admin = TRUE
);

-- Handle user deletion for review table
CREATE OR REPLACE FUNCTION delete_user()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE review
    SET user_id = 'Deleted User',
        user_email = 'Deleted User'
    WHERE user_id = OLD.user_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_user
AFTER DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION delete_user();

--------------------------------------------CREATE DUMMY DATA--------------------------------------------
--------------------------------------------CREATE DUMMY DATA--------------------------------------------
--------------------------------------------CREATE DUMMY DATA--------------------------------------------

INSERT INTO users (user_id, email, role) VALUES ('REMOTE DB WORKING', 'user1@example.com', 'user');
INSERT INTO users (user_id, email, role) VALUES ('auth0|66f639c08901fee18cf8a761','user2@example.com', 'admin');
INSERT INTO users (user_id, email, role) VALUES ('auth0_sub64654', 'user3@example.com', 'user');
INSERT INTO users (user_id, email, role) VALUES ('auth0_sub1', 'user4@example.com', 'user');
INSERT INTO users (user_id, email, role) VALUES ('auth0_sub2', 'user5@example.com', 'user');
INSERT INTO users (user_id, email, role) VALUES ('Deleted User', 'Deleted User', 'guest');

-- Insert dummy data into favorites table
INSERT INTO favorites (user_id, fave_1, fave_2, fave_3, fave_4) 
VALUES ('auth0_sub', 'movie.id1', 'movie.id2', 'movie.id3', 'movie.id4');

-- Insert dummy data into review table
INSERT INTO review (movie_id, movie_name, user_id, user_email, description, rating) 
VALUES ('12345', 'Movie', 'auth0_sub64654', 'user3@example.com', 'good movie', 4);


-- Insert dummy data into groups table
INSERT INTO groups (group_name, description) 
VALUES ('Group 1', 'This is a group description');

-- Insert dummy data into group_members table
INSERT INTO group_members (group_id, user_id, is_admin, status)
VALUES (1, 'auth0_sub1', TRUE, 'accepted');
INSERT INTO group_members (group_id, user_id, is_admin, status)
VALUES (1, 'auth0_sub2', FALSE);

-- Accept group members
-- UPDATE group_members
-- SET status = 'accepted'
-- WHERE user_id = 'auth0_sub2';

-- Reject group members
-- UPDATE group_members
-- SET status = 'rejected'
-- WHERE user_id = 'auth0_sub2';


-- select * from users

-- select * from favorites

-- select * from movie

-- select * from review

-- select * from groups