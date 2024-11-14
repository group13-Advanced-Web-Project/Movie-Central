
 CREATE TABLE users ( 
    id serial PRIMARY KEY,
    auth0_user_id varchar(255) UNIQUE NOT NULL,
    description varchar(255) NOT NULL  
);


-- INSERT INTO users (auth0_user_id, description) VALUES ('auth0|1234567890abcdef', 'user 1');
-- INSERT INTO users (auth0_user_id, description) VALUES ('auth0|abcdef1234567890', 'user 2');
-- INSERT INTO users (auth0_user_id, description) VALUES ('auth0|12345678tdghyujcjf', 'user 3');