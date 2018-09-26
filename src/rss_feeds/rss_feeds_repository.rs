use diesel;
use diesel::dsl::exists;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::PgConnection;
use uuid::Uuid;

use rss_feeds::rss_feed::RssFeed;
use schema::rss_feeds;

pub fn insert_rss_feed(connection: &PgConnection, rss_feed: &RssFeed) -> Result<RssFeed, Error> {
    diesel::insert_into(rss_feeds::table)
        .values(rss_feed)
        .get_result(&*connection)
}

pub fn is_rss_feed_exists(connection: &PgConnection, searched_url: &str) -> Result<bool, Error> {
    use schema::rss_feeds::dsl::*;
    diesel::select(exists(rss_feeds.filter(rss_url.eq(searched_url)))).get_result(&*connection)
}

pub fn find_rss_feed(connection: &PgConnection, rss_feed_uuid: &Uuid) -> Result<RssFeed, Error> {
    rss_feeds::table
        .filter(rss_feeds::uuid.eq(rss_feed_uuid))
        .first::<RssFeed>(&*connection)
}
