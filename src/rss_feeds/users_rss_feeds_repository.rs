use diesel;
use diesel::prelude::*;
use diesel::PgConnection;
use diesel::result::Error;

use users::user::User;
use schema::users_rss_feeds;
use rss_feeds::rss_feed::RssFeed;
use rss_feeds::user_rss_feed::UserRssFeed;

pub fn insert_user_rss_feed(connection: &PgConnection, user_rss_feed: &UserRssFeed) -> Result<UserRssFeed, Error> {
    diesel::insert_into(users_rss_feeds::table)
        .values(user_rss_feed)
        .get_result(&*connection)
}

pub fn is_user_feed_already_inserted(connection: &PgConnection, query_url: &str, user: &User) -> Result<bool, Error> {
    use schema::rss_feeds;
    users_rss_feeds::table
        .inner_join(rss_feeds::table)
        .filter(
            users_rss_feeds::user_uuid.eq(user.uuid)
                .and(rss_feeds::url.eq(query_url))
        )
        .select(rss_feeds::all_columns)
        .get_results::<RssFeed>(&*connection)
        .map(|feeds| feeds.len() > 0)
}
