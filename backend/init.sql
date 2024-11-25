DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS groups;


-- Create users table
CREATE TABLE users ( 
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL
);


INSERT INTO users (user_id, email, role) VALUES ('REMOTE DB WORKING', 'user1@example.com', 'user');
INSERT INTO users (user_id, email, role) VALUES ('auth0|66f639c08901fee18cf8a761','user2@example.com', 'admin');
INSERT INTO users (user_id, email, role) VALUES ('auth0_sub64654', 'user3@example.com', 'user');
INSERT INTO users (user_id, email, role) VALUES ('Deleted User', 'Deleted User', 'guest');


-- Create favorites table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    fave_1 VARCHAR(255),
    fave_2 VARCHAR(255),
    fave_3 VARCHAR(255),
    fave_4 VARCHAR(255)
);

-- Insert dummy data into favorites table
INSERT INTO favorites (user_id, fave_1, fave_2, fave_3, fave_4) 
VALUES ('auth0_sub', 'movie.id1', 'movie.id2', 'movie.id3', 'movie.id4');

-- Create movie table
-- CREATE TABLE movie (
--     id SERIAL PRIMARY KEY,
--     movie_id VARCHAR(255) NOT NULL UNIQUE,
--     review_1 VARCHAR(255),
--     review_2 VARCHAR(255)
-- );

-- Insert dummy data into movie table
INSERT INTO movie (movie_id, review_1, review_2) 
VALUES ('12345', 'review_id1', 'review_id2');

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

-- Insert dummy data into review table
INSERT INTO review (movie_id, movie_name, user_id, user_email, description, rating) 
VALUES ('12345', 'Movie', 'auth0_sub64654', 'user3@example.com', 'good movie', 4);

-- Create groups table
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    group_id VARCHAR(255) NOT NULL,
    member_1 VARCHAR(255),
    member_2 VARCHAR(255),
    member_3 VARCHAR(255),
    member_4 VARCHAR(255)
);

-- Insert dummy data into groups table
INSERT INTO groups (group_id, member_1, member_2, member_3, member_4) 
VALUES ('1', 'auth0_sub1', 'auth0_sub2', 'auth0_sub3', 'auth0_sub4');


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


-- select * from users

-- select * from favorites

-- select * from movie

-- select * from review

-- select * from groups