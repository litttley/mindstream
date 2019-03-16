use crate::app::config::CONFIG;
use crate::errors::Error;
use reqwest::Client;

use crate::models::readable::Readable;

pub fn fetch_readable(client: &Client, url: &str) -> Result<Option<Readable>, Error> {
    let readable_api_url = CONFIG.readable_api_url.clone();
    let url = format!("{}?url={}", readable_api_url, url);
    let mut response = client.get(&url).send()?;
    let readable: Option<Readable> = response.json().ok();
    Ok(readable)
}
