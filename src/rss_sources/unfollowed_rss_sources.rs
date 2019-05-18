use actix_web::web::{block, Data, HttpResponse, Query};
use futures::future::Future;

use crate::auth::Auth;
use crate::config::Config;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::{Pagination, RssSource, User};
use crate::repositories::users_rss_sources::find_unfollowed;

fn unfollowed_rss_sources(
    pool: &DbPool,
    config: &Config,
    pagination: &Pagination,
    user: &User,
) -> Result<Vec<RssSource>, AppError> {
    let connection = pool.get()?;
    let limit = pagination.limit.unwrap_or(config.default_limit);
    let offset = pagination.offset.unwrap_or(0);
    let rss_source = find_unfollowed(&connection, limit, offset, user)?;
    Ok(rss_source)
}

pub fn unfollowed_rss_sources_service(
    pool: Data<DbPool>,
    config: Data<Config>,
    auth: Auth,
    pagination: Query<Pagination>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || unfollowed_rss_sources(&pool, &config, &pagination, &auth.claime.user))
        .and_then(|rss_sources| Ok(HttpResponse::Ok().json(rss_sources)))
        .from_err()
}
