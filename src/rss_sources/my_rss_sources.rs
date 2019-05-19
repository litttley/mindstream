use actix_web::web::{block, Data, HttpResponse, Query};
use futures::future::Future;
use serde_json::{json, Value};

use crate::auth::Auth;
use crate::config::Config;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::{Pagination, RssSource, User, UserRssSource};
use crate::repositories::users_rss_sources::rss_sources_by_user;

fn my_rss_sources(
    pool: &DbPool,
    config: &Config,
    pagination: &Pagination,
    user: &User,
) -> Result<Vec<(RssSource, UserRssSource)>, AppError> {
    let connection = pool.get()?;
    let limit = pagination.limit.unwrap_or(config.default_limit);
    let offset = pagination.offset.unwrap_or(0);
    let rss_source = rss_sources_by_user(&connection, limit, offset, user)?;
    Ok(rss_source)
}

pub fn my_rss_sources_service(
    pool: Data<DbPool>,
    config: Data<Config>,
    auth: Auth,
    pagination: Query<Pagination>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || my_rss_sources(&pool, &config, &pagination, &auth.claime.user))
        .and_then(|rss_sources| {
            Ok(HttpResponse::Ok().json(
                rss_sources
                    .iter()
                    .map(|(rss_source, user_rss_source)| {
                        json!({
                            "rss_source": rss_source,
                            "unreaded": user_rss_source.unreaded,
                        })
                    })
                    .collect::<Vec<Value>>(),
            ))
        })
        .from_err()
}
