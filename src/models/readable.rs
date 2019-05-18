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

impl Readable {
    pub fn is_empty(&self) -> bool {
        self.url.is_none()
            && self.domain.is_none()
            && self.title.is_none()
            && self.content.is_none()
            && self.date_published.is_none()
            && self.lead_image_url.is_none()
            && self.dek.is_none()
            && self.excerpt.is_none()
            && self.word_count.is_none()
            && self.direction.is_none()
            && self.total_pages.is_none()
            && self.rendered_pages.is_none()
            && self.next_page_url.is_none()
    }
}
