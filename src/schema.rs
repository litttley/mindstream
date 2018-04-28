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
