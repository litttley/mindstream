use actix_web::web::{block, Data, HttpResponse, Query};
use futures::future::Future;

use crate::config::Config;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::{Pagination, RssSource};
use crate::repositories::rss_sources::find_rss_sources;

fn public_rss_source(
    pool: &DbPool,
    config: &Config,
    pagination: &Pagination,
) -> Result<Vec<RssSource>, AppError> {
    let connection = pool.get()?;
    let limit = pagination.limit.unwrap_or(config.default_limit);
    let offset = pagination.offset.unwrap_or(0);
    let rss_source = find_rss_sources(&connection, limit, offset)?;
    Ok(rss_source)
}

pub fn public_rss_source_service(
    pool: Data<DbPool>,
    config: Data<Config>,
    pagination: Query<Pagination>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || public_rss_source(&pool, &config, &pagination))
        .and_then(|rss_sources| Ok(HttpResponse::Ok().json(rss_sources)))
        .from_err()
}
