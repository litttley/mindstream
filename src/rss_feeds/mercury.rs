use crate::app::config::CONFIG;
use crate::errors::Error;
use reqwest::Client;
use serde_derive::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReadableData {
    pub url: Option<String>,
    pub domain: Option<String>,
    pub title: Option<String>,
    pub content: Option<String>,
    pub date_published: Option<String>,
    pub lead_image_url: Option<String>,
    pub dek: Option<String>,
    pub excerpt: Option<String>,
    pub word_count: Option<i32>,
    pub direction: Option<String>,
    pub total_pages: Option<i32>,
    pub rendered_pages: Option<i32>,
    pub next_page_url: Option<String>,
}

pub fn fetch_readable(client: &Client, url: &str) -> Result<Option<ReadableData>, Error> {
    let url = format!("http://mercury.postlight.com/parser?url={}", url);
    let api_key = CONFIG.mercury_api_key.clone();
    let mut response = client.get(&url).header("x-api-key", api_key).send()?;
    let readable_data: Option<ReadableData> = response.json().ok();
    Ok(readable_data)
}
