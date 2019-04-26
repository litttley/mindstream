use uuid::Uuid;
use chrono::prelude::*;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Insertable};

use crate::schema::users_rss_feeds;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users_rss_feeds"]
pub struct UserRssFeed {
    pub uuid: Uuid,
    pub viewed: bool,
    pub readed: bool,
    pub read_later: bool,
    pub liked: bool,
    pub disliked: bool,
    pub archived: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub feed_uuid: Uuid,
    pub user_uuid: Uuid,
}

impl UserRssFeed {
    pub fn new(user_uuid: Uuid, feed_uuid: Uuid) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            viewed: false,
            readed: false,
            read_later: false,
            liked: false,
            disliked: false,
            archived: false,
            user_uuid,
            feed_uuid,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }
}
