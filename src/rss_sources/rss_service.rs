use feed_rs::entry::Entry;
use feed_rs::{parser, Feed};
use reqwest;
use reqwest::Error;
use serde::{Deserialize, Serialize};

pub fn fetch_feeds_channel(url: &str) -> Result<Option<Feed>, Error> {
    let mut response = reqwest::get(url)?;
    let feed = parser::parse(&mut response);
    Ok(feed)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Rss {
    pub id: String,
    pub title: Option<String>,
    pub content: Option<String>,
    pub summary: Option<String>,
    pub author: Option<String>,
    pub published: String,
    pub updated: Option<String>,
    pub alternate: Option<String>,
    pub keywords: Vec<String>,
    pub enclosure: Option<String>,
    pub fingerprint: String,
}

impl From<Entry> for Rss {
    fn from(entry: Entry) -> Self {
        Rss {
            id: entry.id,
            title: entry.title,
            content: entry.content,
            summary: entry.summary,
            author: entry.author,
            published: entry.published.to_string(),
            updated: entry.updated.map(|updated| updated.to_string()),
            alternate: entry
                .alternate
                .iter()
                .map(|link| link.href.clone())
                .collect::<Vec<String>>()
                .pop(),
            keywords: entry.keywords,
            enclosure: entry
                .alternate
                .iter()
                .map(|link| link.href.clone())
                .collect::<Vec<String>>()
                .pop(),
            fingerprint: entry.fingerprint,
        }
    }
}
