
-- Create users table
CREATE TABLE users ( 
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL
);


INSERT INTO users (user_id, role) VALUES ('REMOTE DB WORKING', 'user');
INSERT INTO users (user_id, role) VALUES ('auth0|66f639c08901fee18cf8a761', 'admin');


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
CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    movie_id VARCHAR(255) NOT NULL,
    review_1 VARCHAR(255),
    review_2 VARCHAR(255)
);

-- Insert dummy data into movie table
INSERT INTO movie (movie_id, review_1, review_2) 
VALUES ('12345', 'review_id1', 'review_id2');

-- Create review table
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    review_id VARCHAR(255) NOT NULL,
    movie_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    description TEXT,
    rating INT,
    timestamp VARCHAR(255)
);

-- Insert dummy data into review table
INSERT INTO review (review_id, movie_id, user_id, description, rating, timestamp) 
VALUES ('1', '12345', 'auth0_sub64654', 'good movie', 4, '021584.102.12');

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




-- select * from users

-- select * from favorites

-- select* from movie

-- select * from movie

-- select * from groups