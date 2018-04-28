-- Your SQL goes here

CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY NOT NULL,
    login TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);
