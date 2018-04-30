-- Your SQL goes here

CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY NOT NULL,
    login TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);

CREATE TABLE rss_sources (
    uuid UUID PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    website TEXT NOT NULL,
    description TEXT,
    language TEXT,
    icon_url TEXT,
    cover_url TEXT,
    visual_url TEXT,
    topics TEXT ARRAY,
    last_updated TIMESTAMP,
    error TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);

CREATE TABLE users_rss_sources (
    uuid UUID PRIMARY KEY,
    user_uuid UUID NOT NULL REFERENCES users(uuid),
    rss_source_uuid UUID NOT NULL REFERENCES rss_sources(uuid)
);
