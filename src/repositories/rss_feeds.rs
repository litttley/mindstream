use diesel::{dsl::exists, prelude::*, result::Error, PgConnection};
use uuid::Uuid;

use crate::models::RssFeed;
use crate::schema::rss_feeds;

pub fn insert_rss_feed(connection: &PgConnection, rss_feed: &RssFeed) -> Result<RssFeed, Error> {
    diesel::insert_into(rss_feeds::table)
        .values(rss_feed)
        .get_result(&*connection)
}

pub fn is_rss_feed_exists(connection: &PgConnection, searched_url: &str) -> Result<bool, Error> {
    use crate::schema::rss_feeds::dsl::*;
    diesel::select(exists(rss_feeds.filter(rss_url.eq(searched_url)))).get_result(&*connection)
}

pub fn find_rss_feed(connection: &PgConnection, rss_feed_uuid: &Uuid) -> Result<RssFeed, Error> {
    rss_feeds::table
        .filter(rss_feeds::uuid.eq(rss_feed_uuid))
        .first::<RssFeed>(&*connection)
}
