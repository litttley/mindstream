use chrono::prelude::*;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::schema::rss_sources;

#[derive(Debug, Clone, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "rss_sources"]
pub struct RssSource {
    pub uuid: Uuid,
    pub url: String,
    pub title: String,
    pub website: String,
    pub description: Option<String>,
    pub language: Option<String>,
    pub icon_url: Option<String>,
    pub cover_url: Option<String>,
    pub visual_url: Option<String>,
    pub topics: Option<Vec<String>>,
    pub last_updated: Option<NaiveDateTime>,
    pub error: Option<String>,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
}

impl RssSource {
    pub fn new(
        url: &str,
        title: &str,
        website: &str,
        description: Option<String>,
        language: Option<String>,
        icon_url: Option<String>,
        cover_url: Option<String>,
        visual_url: Option<String>,
        topics: Option<Vec<String>>,
        last_updated: Option<NaiveDateTime>,
    ) -> Self {
        RssSource {
            uuid: Uuid::new_v4(),
            url: url.to_owned(),
            title: title.to_owned(),
            website: website.to_owned(),
            description,
            language,
            icon_url,
            cover_url,
            visual_url,
            topics,
            last_updated,
            error: None,
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc(),
        }
    }
}
