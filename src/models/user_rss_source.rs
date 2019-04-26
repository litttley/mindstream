use uuid::Uuid;
use serde::{Deserialize, Serialize};
use crate::models::{
    user::User,
    rss_source::RssSource,
    rss_source_category::RssSourceCategory,
};
use diesel::{Queryable, Insertable};

use crate::schema::users_rss_sources;

#[derive(Debug, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users_rss_sources"]
pub struct UserRssSource {
    pub uuid: Uuid,
    pub unreaded: i64,
    pub user_uuid: Uuid,
    pub rss_source_uuid: Uuid,
    pub rss_source_category_uuid: Uuid,
}

impl UserRssSource {
    pub fn new(user: &User, rss_source: &RssSource, rss_source_category: &RssSourceCategory) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            unreaded: 0,
            user_uuid: user.uuid,
            rss_source_uuid: rss_source.uuid,
            rss_source_category_uuid: rss_source_category.uuid
        }
    }
}
