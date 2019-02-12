use chrono::prelude::*;
use chrono::NaiveDateTime;
use feed_rs::Feed;
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
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
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
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }

    pub fn from_feed(url: &str, rss_feed: Feed) -> Self {
        Self::new(
            url,
            &rss_feed.title.unwrap_or_else(|| url.to_owned()),
            &rss_feed.website.unwrap_or_else(|| url.to_owned()),
            rss_feed.description,
            rss_feed.language,
            rss_feed.icon_url,
            rss_feed.cover_url,
            rss_feed.visual_url,
            rss_feed.topics,
            rss_feed.last_updated,
        )
    }
}
