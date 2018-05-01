use diesel;
use diesel::prelude::*;
use diesel::PgConnection;
use diesel::result::Error;
use diesel::dsl::exists;

use schema::rss_feeds;
use rss_feeds::rss_feed::RssFeed;

pub fn insert_rss_feed(connection: &PgConnection, rss_feed: &RssFeed) -> Result<RssFeed, Error> {
    diesel::insert_into(rss_feeds::table)
        .values(rss_feed)
        .get_result(&*connection)
}

pub fn is_rss_feed_exists(connection: &PgConnection, searched_url: &str) -> Result<bool, Error> {
    use schema::rss_feeds::dsl::*;
    diesel::select(exists(rss_feeds.filter(url.eq(searched_url))))
        .get_result(&*connection)
}
