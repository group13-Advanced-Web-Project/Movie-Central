
 CREATE TABLE users ( 
    id serial PRIMARY KEY,
    user_id varchar(255) UNIQUE NOT NULL
 );




INSERT INTO users (auth0_user_id) VALUES ('auth0|1234567890abcdef');
INSERT INTO users (auth0_user_id) VALUES ('auth0|abcdef1234567890');
INSERT INTO users (auth0_user_id) VALUES ('auth0|12345678tdghyujcjf');