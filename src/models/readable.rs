use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Readable {
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
