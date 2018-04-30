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
    users_rss_sources (uuid) {
        uuid -> Uuid,
        user_uuid -> Uuid,
        rss_source_uuid -> Uuid,
    }
}

joinable!(users_rss_sources -> rss_sources (rss_source_uuid));
joinable!(users_rss_sources -> users (user_uuid));

allow_tables_to_appear_in_same_query!(
    rss_sources,
    users,
    users_rss_sources,
);
