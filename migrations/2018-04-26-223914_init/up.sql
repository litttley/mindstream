-- Your SQL goes here

CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY NOT NULL,
    login TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users_rss_sources (
    uuid UUID PRIMARY KEY,
    unreaded BIGINT NOT NULL DEFAULT 0,
    user_uuid UUID NOT NULL REFERENCES users(uuid),
    rss_source_uuid UUID NOT NULL REFERENCES rss_sources(uuid),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rss_feeds (
    uuid UUID PRIMARY KEY,
    rss_url TEXT NOT NULL,
    resolved_url TEXT,
    rss JSONB,
    readable JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    rss_source_uuid UUID NOT NULL REFERENCES rss_sources(uuid)
);

CREATE TABLE IF NOT EXISTS users_rss_feeds (
    uuid UUID PRIMARY KEY,
    viewed BOOLEAN NOT NULL DEFAULT false,
    readed BOOLEAN NOT NULL DEFAULT false,
    read_later BOOLEAN NOT NULL DEFAULT false,
    liked BOOLEAN NOT NULL DEFAULT false,
    disliked BOOLEAN NOT NULL DEFAULT false,
    archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    feed_uuid UUID NOT NULL REFERENCES rss_feeds(uuid),
    user_uuid UUID NOT NULL REFERENCES users(uuid)
);
