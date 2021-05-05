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
);

CREATE TABLE followers (
    username VARCHAR(255),
    following VARCHAR(255)
);

CREATE TABLE comments (
    username VARCHAR(255),
    comment VARCHAR(255),
    post_id INT
);

CREATE TABLE likes (
    username VARCHAR(255),
    post_id INT
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    current_session_user VARCHAR(255),
    action VARCHAR(255),
    username VARCHAR(255),
    post_id VARCHAR(255),
    notification_date date
);
