use diesel;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::PgConnection;

use crate::models::rss_source_category::RssSourceCategory;
use crate::models::user::User;
use crate::schema::rss_sources_categories;
use crate::schema::rss_sources_categories::dsl::*;

pub fn insert(connection: &PgConnection, rss_source_category: &RssSourceCategory) -> Result<RssSourceCategory, Error> {
    diesel::insert_into(rss_sources_categories::table)
        .values(rss_source_category)
        .get_result(&*connection)
}

pub fn find_rss_sources_categories(
    connection: &PgConnection,
    user: &User,
    //limit: i64,
    //offset: i64,
) -> Result<Vec<RssSourceCategory>, Error> {
    rss_sources_categories
        .filter(rss_sources_categories::user_uuid.eq(user.uuid))
        //.limit(limit)
        //.offset(offset)
        .load::<RssSourceCategory>(&*connection)
}

