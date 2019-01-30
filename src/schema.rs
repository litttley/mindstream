table! {
    rss_feeds (uuid) {
        uuid -> Uuid,
        rss_url -> Text,
        resolved_url -> Nullable<Text>,
        rss -> Nullable<Jsonb>,
        readable -> Nullable<Jsonb>,
        created -> Timestamp,
        updated -> Timestamp,
        rss_source_uuid -> Uuid,
    }
}

table! {
    rss_sources (uuid) {
        uuid -> Uuid,
        url -> Text,
        title -> Text,
        website -> Text,
        description -> Nullable<Text>,
        language -> Nullable<Text>,
        icon_url -> Nullable<Text>,
        cover_url -> Nullable<Text>,
        visual_url -> Nullable<Text>,
        topics -> Nullable<Array<Text>>,
        last_updated -> Nullable<Timestamp>,
        error -> Nullable<Text>,
        created -> Timestamp,
        updated -> Timestamp,
    }
}

table! {
    rss_sources_categories (uuid) {
        uuid -> Uuid,
        title -> Text,
        created -> Timestamp,
        updated -> Timestamp,
        user_uuid -> Uuid,
    }
}

table! {
    users (uuid) {
        uuid -> Uuid,
        login -> Text,
        email -> Text,
        password -> Text,
        created -> Timestamp,
        updated -> Timestamp,
    }
}

table! {
    users_rss_feeds (uuid) {
        uuid -> Uuid,
        reaction -> Text,
        created -> Timestamp,
        updated -> Timestamp,
        feed_uuid -> Uuid,
        user_uuid -> Uuid,
    }
}

table! {
    users_rss_sources (uuid) {
        uuid -> Uuid,
        unreaded -> Int8,
        user_uuid -> Uuid,
        rss_source_uuid -> Uuid,
        rss_source_category_uuid -> Uuid,
    }
}

joinable!(rss_feeds -> rss_sources (rss_source_uuid));
joinable!(rss_sources_categories -> users (user_uuid));
joinable!(users_rss_feeds -> rss_feeds (feed_uuid));
joinable!(users_rss_feeds -> users (user_uuid));
joinable!(users_rss_sources -> rss_sources (rss_source_uuid));
joinable!(users_rss_sources -> rss_sources_categories (rss_source_category_uuid));
joinable!(users_rss_sources -> users (user_uuid));

allow_tables_to_appear_in_same_query!(
    rss_feeds,
    rss_sources,
    rss_sources_categories,
    users,
    users_rss_feeds,
    users_rss_sources,
);
