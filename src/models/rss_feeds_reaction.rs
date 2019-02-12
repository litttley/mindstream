use serde::{Deserialize, Serialize};
use crate::schema::users_rss_feeds;

#[derive(Debug, Deserialize, Serialize, AsChangeset)]
#[table_name = "users_rss_feeds"]
pub struct RssFeedsReaction {
    pub viewed: Option<bool>,
    pub readed: Option<bool>,
    pub read_later: Option<bool>,
    pub liked: Option<bool>,
    pub disliked: Option<bool>,
    pub archived: Option<bool>,
}
