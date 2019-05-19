use diesel;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::PgConnection;
use uuid::Uuid;

use crate::models::rss_source::RssSource;
use crate::schema::rss_sources;

pub fn insert(connection: &PgConnection, rss_source: &RssSource) -> Result<RssSource, Error> {
    diesel::insert_into(rss_sources::table)
        .values(rss_source)
        .get_result(&*connection)
}

pub fn find_rss_sources(
    connection: &PgConnection,
    limit: i64,
    offset: i64,
) -> Result<Vec<RssSource>, Error> {
    use crate::schema::rss_sources::dsl::*;
    rss_sources
        .limit(limit)
        .offset(offset)
        .load::<RssSource>(&*connection)
}

#[allow(dead_code)]
pub fn delete(connection: &PgConnection, rss_source_uuid: &Uuid) -> Result<usize, Error> {
    use crate::schema::rss_sources::dsl::*;
    diesel::delete(rss_sources.filter(uuid.eq(rss_source_uuid))).execute(connection)
}

#[allow(dead_code)]
pub fn find_by_uuid(connection: &PgConnection, searched_uuid: &Uuid) -> Result<RssSource, Error> {
    use crate::schema::rss_sources::dsl::*;
    rss_sources
        .filter(uuid.eq(searched_uuid))
        .first::<RssSource>(&*connection)
}

pub fn find_by_url(connection: &PgConnection, searched_url: &str) -> Result<RssSource, Error> {
    use crate::schema::rss_sources::dsl::*;
    rss_sources
        .filter(url.eq(searched_url))
        .first::<RssSource>(&*connection)
}

pub fn search(
    connection: &PgConnection,
    query: &str,
    limit: i64,
    offset: i64,
) -> Result<Vec<RssSource>, Error> {
    use crate::schema::rss_sources::dsl::*;
    rss_sources
        .filter(title.ilike(&format!("%{}%", query)))
        .limit(limit)
        .offset(offset)
        .load::<RssSource>(&*connection)
}
