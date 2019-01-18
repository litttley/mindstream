use diesel;
use diesel::dsl::exists;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::PgConnection;
use uuid::Uuid;

use crate::models::rss_source::RssSource;
use crate::models::user_rss_source::UserRssSource;
use crate::schema::users_rss_sources;
use crate::users::user::User;

pub fn insert(
    connection: &PgConnection,
    user_rss_source: &UserRssSource,
) -> Result<UserRssSource, Error> {
    diesel::insert_into(users_rss_sources::table)
        .values(user_rss_source)
        .get_result(&*connection)
}

pub fn is_exists(
    connection: &PgConnection,
    user_rss_source: &UserRssSource,
) -> Result<bool, Error> {
    use crate::schema::users_rss_sources::dsl::*;
    diesel::select(exists(
        users_rss_sources
            .filter(user_uuid.eq(user_rss_source.user_uuid))
            .filter(rss_source_uuid.eq(user_rss_source.rss_source_uuid)),
    ))
    .get_result(&*connection)
}

pub fn rss_sources_by_user(
    connection: &PgConnection,
    limit: i64,
    offset: i64,
    user: &User,
) -> Result<Vec<(RssSource, UserRssSource)>, Error> {
    use crate::schema::rss_sources;
    rss_sources::table
        .inner_join(users_rss_sources::table)
        .filter(users_rss_sources::user_uuid.eq(user.uuid))
        .limit(limit)
        .offset(offset)
        .get_results::<(RssSource, UserRssSource)>(&*connection)
}

pub fn find_rss_source_subscribers(
    connection: &PgConnection,
    rss_source: &RssSource,
) -> Result<Vec<User>, Error> {
    use crate::schema::users;
    users::table
        .inner_join(users_rss_sources::table)
        .filter(users_rss_sources::rss_source_uuid.eq(rss_source.uuid))
        .select(users::all_columns)
        .get_results::<User>(&*connection)
}

pub fn find_unfollowed(
    connection: &PgConnection,
    limit: i64,
    offset: i64,
    user: &User,
) -> Result<Vec<RssSource>, Error> {
    use crate::schema::rss_sources;
    rss_sources::table
        .left_join(users_rss_sources::table)
        .filter(
            users_rss_sources::user_uuid
                .is_null()
                .or(users_rss_sources::user_uuid.ne(user.uuid)),
        )
        .limit(limit)
        .offset(offset)
        .select(rss_sources::all_columns)
        .get_results::<RssSource>(&*connection)
}

pub fn increment_unreaded_rss_sources(
    connection: &PgConnection,
    rss_source: &RssSource,
    user: &User,
) -> Result<usize, Error> {
    diesel::sql_query(
        r#"
        UPDATE users_rss_sources 
        SET unreaded = unreaded + 1 
        WHERE users_rss_sources.rss_source_uuid = $1
            AND users_rss_sources.user_uuid = $2
    "#,
    )
    .bind::<diesel::sql_types::Uuid, _>(rss_source.uuid)
    .bind::<diesel::sql_types::Uuid, _>(user.uuid)
    .execute(&*connection)
}

pub fn decrement_unreaded_rss_sources(
    connection: &PgConnection,
    rss_source_uuid: &Uuid,
    user: &User,
) -> Result<usize, Error> {
    diesel::sql_query(
        r#"
        UPDATE users_rss_sources
        SET unreaded = unreaded - 1
        WHERE users_rss_sources.rss_source_uuid = $1
            AND users_rss_sources.user_uuid = $2
    "#,
    )
    .bind::<diesel::sql_types::Uuid, _>(rss_source_uuid)
    .bind::<diesel::sql_types::Uuid, _>(user.uuid)
    .execute(&*connection)
}
