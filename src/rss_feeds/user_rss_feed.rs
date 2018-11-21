use chrono::prelude::*;
use chrono::NaiveDateTime;
use serde::de::{Deserialize, Deserializer, Error};
use serde_derive::{Deserialize, Serialize};
use std::str::FromStr;
use uuid::Uuid;

use schema::users_rss_feeds;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users_rss_feeds"]
pub struct UserRssFeed {
    pub uuid: Uuid,
    pub reaction: String,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
    pub feed_uuid: Uuid,
    pub user_uuid: Uuid,
}

impl UserRssFeed {
    pub fn new(user_uuid: Uuid, feed_uuid: Uuid, reaction: String) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            reaction,
            user_uuid,
            feed_uuid,
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc(),
        }
    }
}

#[derive(Debug, EnumString, ToString)]
pub enum Reaction {
    Unreaded,
    Readed,
    ReadLater,
    Viewed,
    Liked,
    Disliked,
    Archived,
}

impl<'de> Deserialize<'de> for Reaction {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let reaction = String::deserialize(deserializer)?;
        let reaction = Reaction::from_str(&reaction).map_err(move |_| {
            Error::unknown_field(
                "reaction",
                &[
                    "Unreaded",
                    "Readed",
                    "ReadLater",
                    "Viewed",
                    "Liked",
                    "Disliked",
                    "Archived",
                ],
            )
        })?;
        Ok(reaction)
    }
}
