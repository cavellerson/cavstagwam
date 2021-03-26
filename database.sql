CREATE DATABASE cavstagwam;

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    username VARCHAR(255),
    likes INT,
    image TEXT
);

CREATE TABLE usernames (
    post_id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255)
)
