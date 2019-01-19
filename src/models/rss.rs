use serde::{Deserialize, Serialize};

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
