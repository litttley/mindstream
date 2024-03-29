use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::schema::users_rss_sources;

#[derive(Debug, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users_rss_sources"]
pub struct UserRssSource {
    pub uuid: Uuid,
    pub unreaded: i64,
    pub user_uuid: Uuid,
    pub rss_source_uuid: Uuid,
}

impl UserRssSource {
    pub fn new(user_uuid: Uuid, rss_source_uuid: Uuid) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            unreaded: 0,
            user_uuid,
            rss_source_uuid,
        }
    }
}
