use diesel;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::PgConnection;
use uuid::Uuid;

use crate::models::rss_feed::RssFeed;
use crate::models::user::User;
use crate::models::user_rss_feed::UserRssFeed;
use crate::models::rss_feeds_reaction::RssFeedsReaction;
use crate::schema::{rss_feeds, users_rss_feeds};

pub fn insert_user_rss_feed(
    connection: &PgConnection,
    user_rss_feed: &UserRssFeed,
) -> Result<UserRssFeed, Error> {
    diesel::insert_into(users_rss_feeds::table)
        .values(user_rss_feed)
        .get_result(&*connection)
}

pub fn is_user_feed_already_inserted(
    connection: &PgConnection,
    query_url: &str,
    user: &User,
) -> Result<bool, Error> {
    use crate::schema::rss_feeds;
    users_rss_feeds::table
        .inner_join(rss_feeds::table)
        .filter(
            users_rss_feeds::user_uuid
                .eq(user.uuid)
                .and(rss_feeds::rss_url.eq(query_url)),
        )
        .select(rss_feeds::all_columns)
        .get_results::<RssFeed>(&*connection)
        .map(|feeds| !feeds.is_empty())
}

pub fn find_rss_feeds(
    connection: &PgConnection,
    limit: i64,
    offset: i64,
    user: &User,
    reaction: &RssFeedsReaction,
) -> Result<Vec<(RssFeed, UserRssFeed)>, Error> {
    use crate::schema::rss_feeds;
    rss_feeds::table
        .inner_join(users_rss_feeds::table)
        .filter(
            users_rss_feeds::viewed
                .eq(reaction.viewed.unwrap_or(false))
                .and(users_rss_feeds::user_uuid.eq(user.uuid))
                .and(users_rss_feeds::liked.eq(reaction.liked.unwrap_or(false))), // TODO add other reactions
        )
        .order_by(rss_feeds::updated_at.asc())
        .limit(limit)
        .offset(offset)
        .select((rss_feeds::all_columns, users_rss_feeds::all_columns))
        .get_results::<(RssFeed, UserRssFeed)>(&*connection)
}

pub fn find_rss_feeds_by_rss_source(
    connection: &PgConnection,
    limit: i64,
    offset: i64,
    rss_source_uuid: &Uuid,
    user: &User,
) -> Result<Vec<(RssFeed, UserRssFeed)>, Error> {
    rss_feeds::table
        .inner_join(users_rss_feeds::table)
        .filter(
            users_rss_feeds::viewed
                .eq(false)
                .and(users_rss_feeds::user_uuid.eq(user.uuid))
                .and(rss_feeds::rss_source_uuid.eq(rss_source_uuid)),
        )
        .order_by(rss_feeds::updated_at.asc())
        .limit(limit)
        .offset(offset)
        .select((rss_feeds::all_columns, users_rss_feeds::all_columns))
        .get_results::<(RssFeed, UserRssFeed)>(&*connection)
}



pub fn update_rss_feed_reaction(
    connection: &PgConnection,
    rss_feed_uuid: &Uuid,
    reaction: &RssFeedsReaction,
    user: &User,
) -> Result<UserRssFeed, Error> {
    diesel::update(
        users_rss_feeds::table.filter(
            users_rss_feeds::user_uuid
                .eq(user.uuid)
                .and(users_rss_feeds::feed_uuid.eq(rss_feed_uuid)),
        ),
    )
    .set(reaction)
    .get_result::<UserRssFeed>(&*connection)
}

pub fn find_user_rss_feed(
    connection: &PgConnection,
    user_rss_feed_uuid: &Uuid,
    user: &User,
) -> Result<UserRssFeed, Error> {
    users_rss_feeds::table
        .filter(
            users_rss_feeds::feed_uuid
                .eq(user_rss_feed_uuid)
                .and(users_rss_feeds::user_uuid.eq(user.uuid)),
        )
        .first::<UserRssFeed>(&*connection)
}
