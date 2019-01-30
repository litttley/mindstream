use chrono::NaiveDateTime;
use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::{
    user::User,
};
use crate::schema::rss_sources_categories;

#[derive(Debug, Clone, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "rss_sources_categories"]
pub struct RssSourceCategory {
    pub uuid: Uuid,
    pub title: String,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
    pub user_uuid: Uuid,
}

impl RssSourceCategory {
    pub fn new(title: String, user: &User) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            title,
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc(),
            user_uuid: user.uuid,
        }
    }
}

