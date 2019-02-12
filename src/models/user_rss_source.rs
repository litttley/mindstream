use uuid::Uuid;
use chrono::prelude::*;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::schema::users_rss_sources;

#[derive(Debug, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users_rss_sources"]
pub struct UserRssSource {
    pub uuid: Uuid,
    pub unreaded: i64,
    pub user_uuid: Uuid,
    pub rss_source_uuid: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl UserRssSource {
    pub fn new(user_uuid: Uuid, rss_source_uuid: Uuid) -> Self {
        UserRssSource {
            uuid: Uuid::new_v4(),
            unreaded: 0,
            user_uuid,
            rss_source_uuid,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }
}
