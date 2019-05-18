use reqwest::Client;

use crate::config::Config;
use crate::errors::AppError;
use crate::models::readable::Readable;

pub fn fetch_readable(
    client: &Client,
    config: &Config,
    url: &str,
) -> Result<Option<Readable>, AppError> {
    let readable_api_url = config.readable_api_url.clone();
    let url = format!("{}?url={}", readable_api_url, url);
    let mut response = client.get(&url).send()?;
    let readable: Option<Readable> = response.json().ok();
    Ok(readable)
}
