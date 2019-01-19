use crate::app::config::CONFIG;
use crate::errors::Error;
use reqwest::Client;

use crate::models::readable::Readable;

pub fn fetch_readable(client: &Client, url: &str) -> Result<Option<Readable>, Error> {
    let url = format!("http://mercury.postlight.com/parser?url={}", url);
    let api_key = CONFIG.mercury_api_key.clone();
    let mut response = client.get(&url).header("x-api-key", api_key).send()?;
    let readable: Option<Readable> = response.json().ok();
    Ok(readable)
}
