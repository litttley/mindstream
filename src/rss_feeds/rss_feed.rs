use chrono::prelude::*;
use chrono::NaiveDateTime;
use serde_json;
use serde_json::Value;
use uuid::Uuid;
use serde_derive::{Deserialize, Serialize};

use rss_feeds::mercury::ReadableData;
use rss_sources::rss_service::Rss;
use rss_sources::rss_source::RssSource;
use schema::rss_feeds;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "rss_feeds"]
pub struct RssFeed {
    pub uuid: Uuid,
    pub rss_url: String,
    pub resolved_url: Option<String>,
    pub rss: Option<Value>,
    pub readable: Option<Value>,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
    pub rss_source_uuid: Uuid,
}

impl RssFeed {
    pub fn new(
        rss_url: String,
        resolved_url: Option<String>,
        rss: Option<Rss>,
        readable: Option<ReadableData>,
        rss_source: &RssSource,
    ) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            rss_url,
            resolved_url,
            rss: serde_json::to_value(rss).ok(),
            readable: serde_json::to_value(readable).ok(),
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc(),
            rss_source_uuid: rss_source.uuid,
        }
    }
}
