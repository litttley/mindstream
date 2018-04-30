use reqwest;
use feed_rs::{Feed, parser};
use reqwest::Error;

pub fn fetch_feeds_channel(url: &str) -> Result<Option<Feed>, Error> {
    let mut response = reqwest::get(url)?;
    let feed = parser::parse(&mut response);
    Ok(feed)
}
