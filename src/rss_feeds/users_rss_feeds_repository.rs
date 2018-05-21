use uuid::Uuid;
use diesel;
use diesel::prelude::*;
use diesel::PgConnection;
use diesel::result::Error;

use users::user::User;
use schema::{rss_feeds, users_rss_feeds};
use rss_feeds::rss_feed::RssFeed;
use rss_feeds::user_rss_feed::{Reaction, UserRssFeed};

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
                .and(rss_feeds::rss_url.eq(query_url))
        )
        .select(rss_feeds::all_columns)
        .get_results::<RssFeed>(&*connection)
        .map(|feeds| feeds.len() > 0)
}

pub fn find_rss_feeds(connection: &PgConnection, limit: i64, offset: i64, reaction: &Reaction, user: &User) -> Result<Vec<RssFeed>, Error> {
    use schema::rss_feeds;
    rss_feeds::table
        .inner_join(users_rss_feeds::table)
        .filter(
            users_rss_feeds::reaction.eq(&reaction.to_string())
                .and(users_rss_feeds::user_uuid.eq(user.uuid))
        )
        .order_by(rss_feeds::updated.asc())
        .limit(limit)
        .offset(offset)
        .select(rss_feeds::all_columns)
        .get_results::<RssFeed>(&*connection)
}

pub fn find_rss_feeds_by_rss_source(connection: &PgConnection, limit: i64, offset: i64, reaction: &Reaction, rss_source_uuid: &Uuid, user: &User) -> Result<Vec<RssFeed>, Error> {
    rss_feeds::table
        .inner_join(users_rss_feeds::table)
        .filter(
            users_rss_feeds::reaction.eq(&reaction.to_string())
                .and(users_rss_feeds::user_uuid.eq(user.uuid))
                .and(rss_feeds::rss_source_uuid.eq(rss_source_uuid))
        )
        .order_by(rss_feeds::updated.asc())
        .limit(limit)
        .offset(offset)
        .select(rss_feeds::all_columns)
        .get_results::<RssFeed>(&*connection)
}

pub fn update_rss_feed_reaction(connection: &PgConnection, rss_feed_uuid: &Uuid, query_reaction: &Reaction, user: &User) -> Result<UserRssFeed, Error> {
    diesel::update(
            users_rss_feeds::table
                .filter(users_rss_feeds::user_uuid.eq(user.uuid)
                .and(users_rss_feeds::feed_uuid.eq(rss_feed_uuid)))
        )
        .set(users_rss_feeds::reaction.eq(query_reaction.to_string()))
        .get_result::<UserRssFeed>(&*connection)
}

pub fn find_user_rss_feed(connection: &PgConnection, user_rss_feed_uuid: &Uuid, user: &User) -> Result<UserRssFeed, Error> {
    users_rss_feeds::table
        .filter(
            users_rss_feeds::feed_uuid.eq(user_rss_feed_uuid)
                .and(users_rss_feeds::user_uuid.eq(user.uuid))
        )
        .first::<UserRssFeed>(&*connection)
}
