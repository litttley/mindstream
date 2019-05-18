use actix_web::web::{block, Data, HttpResponse, Query};
use diesel::PgConnection;
use futures::future::Future;
use serde::Deserialize;
use url::Url;
use validator::Validate;
use validator_derive::Validate;

use crate::config::Config;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::{Pagination, RssSource};
use crate::repositories::rss_sources::{find_by_url, insert, search};
use crate::services::rss_service::fetch_feeds_channel;

#[derive(Debug, Validate, Deserialize)]
pub struct SearchRssSource {
    #[validate(length(min = "1"))]
    pub query: String,
}

fn search_rss_source(
    pool: &DbPool,
    config: &Config,
    search_query: &SearchRssSource,
    pagination: &Pagination,
) -> Result<Vec<RssSource>, AppError> {
    search_query.validate()?;
    let connection = pool.get()?;
    let query = &search_query.query;
    let limit = pagination.limit.unwrap_or(config.default_limit);
    let offset = pagination.offset.unwrap_or(0);
    if Url::parse(query).is_ok() {
        find_rss_source_by_url(&connection, query)
    } else {
        Ok(search(&connection, query, limit, offset)?)
    }
}

fn find_rss_source_by_url(
    connection: &PgConnection,
    url: &str,
) -> Result<Vec<RssSource>, AppError> {
    if let Ok(rss_source) = find_by_url(connection, url) {
        Ok(vec![rss_source])
    } else if let Ok(Some(rss_feed)) = fetch_feeds_channel(url) {
        let rss_source = RssSource::from_feed(url, rss_feed);
        insert(connection, &rss_source)?;
        Ok(vec![rss_source])
    } else {
        Ok(vec![])
    }
}

pub fn search_rss_source_service(
    pool: Data<DbPool>,
    config: Data<Config>,
    query: Query<SearchRssSource>,
    pagination: Query<Pagination>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || search_rss_source(&pool, &config, &query, &pagination))
        .and_then(|rss_sources| Ok(HttpResponse::Ok().json(rss_sources)))
        .from_err()
}
