use uuid::Uuid;
use serde_json::Value;
use chrono::prelude::*;
use chrono::NaiveDateTime;
use serde_json;

use schema::rss_feeds;
use rss_sources::rss_service::Rss;
use rss_feeds::mercury::ReadableData;
use rss_sources::rss_source::RssSource;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name="rss_feeds"]
pub struct RssFeed {
    pub uuid: Uuid,
    pub url: String,
    pub rss: Option<Value>,
    pub readable: Option<Value>,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
    pub rss_source_uuid: Uuid,
}

impl RssFeed {
    pub fn new(url: &str, rss: Option<Rss>, readable: Option<ReadableData>, rss_source: &RssSource) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            url: url.to_owned(),
            rss: serde_json::to_value(rss).ok(),
            readable: serde_json::to_value(readable).ok(),
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc(),
            rss_source_uuid: rss_source.uuid
        }
    }
}
