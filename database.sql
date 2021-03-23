CREATE DATABASE cavstagwam;

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    username VARCHAR(255),
    likes INT,
    image TEXT
);
