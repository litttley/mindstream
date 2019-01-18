use feed_rs::entry::Entry;
use feed_rs::{parser, Feed};
use reqwest;
use reqwest::Error;

use crate::models::rss::Rss;

pub fn fetch_feeds_channel(url: &str) -> Result<Option<Feed>, Error> {
    let mut response = reqwest::get(url)?;
    let feed = parser::parse(&mut response);
    Ok(feed)
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
