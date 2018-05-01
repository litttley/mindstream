use uuid::Uuid;
use chrono::prelude::*;
use chrono::NaiveDateTime;

use schema::users_rss_feeds;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name="users_rss_feeds"]
pub struct UserRssFeed {
    pub uuid: Uuid,
    pub reaction: String,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
    pub feed_uuid: Uuid,
    pub user_uuid: Uuid,
}

impl UserRssFeed {
    pub fn new(user_uuid: Uuid, feed_uuid: Uuid, reaction: &str) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            reaction: reaction.to_owned(),
            user_uuid,
            feed_uuid,
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc(),
        }
    }
}
