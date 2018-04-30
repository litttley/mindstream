use diesel;
use diesel::prelude::*;
use diesel::PgConnection;
use diesel::result::Error;
use diesel::dsl::exists;

use users::user::User;
use rss_sources::rss_source::RssSource;
use rss_sources::user_rss_source::UserRssSource;
use schema::users_rss_sources;

pub fn insert(connection: &PgConnection, user_rss_source: &UserRssSource) -> Result<UserRssSource, Error> {
    diesel::insert_into(users_rss_sources::table)
        .values(user_rss_source)
        .get_result(&*connection)
}

pub fn is_exists(connection: &PgConnection, user_rss_source: &UserRssSource) -> Result<bool, Error> {
    use schema::users_rss_sources::dsl::*;
    diesel::select(
        exists(
            users_rss_sources
                .filter(user_uuid.eq(user_rss_source.user_uuid))
                .filter(rss_source_uuid.eq(user_rss_source.rss_source_uuid))
        )
    ).get_result(&*connection)
}

pub fn rss_sources_by_user(connection: &PgConnection, limit: i64, offset: i64, user: &User) -> Result<Vec<RssSource>, Error> {
    use schema::rss_sources;
    rss_sources::table
        .inner_join(users_rss_sources::table)
        .filter(users_rss_sources::user_uuid.eq(user.uuid))
        .limit(limit)
        .offset(offset)
        .select(rss_sources::all_columns)
        .get_results::<RssSource>(&*connection)
}
