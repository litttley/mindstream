use actix_web::web::{block, Data, HttpResponse, Query};
use futures::future::Future;
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

use crate::auth::Auth;
use crate::config::Config;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::{Pagination, Reaction, RssFeed, User, UserRssFeed};
use crate::repositories::users_rss_feeds::{find_rss_feeds, find_rss_feeds_by_rss_source};

#[derive(Debug, Deserialize)]
pub struct RssFeedsQuery {
    pub rss_source_uuid: Option<Uuid>,
    pub reaction: Option<Reaction>,
}

fn get_rss_feeds(
    pool: &DbPool,
    config: &Config,
    query: RssFeedsQuery,
    pagination: &Pagination,
    user: &User,
) -> Result<Vec<(RssFeed, UserRssFeed)>, AppError> {
    let connection = pool.get()?;
    let limit = pagination.limit.unwrap_or(config.default_limit);
    let offset = pagination.offset.unwrap_or(0);
    let reaction = query.reaction.unwrap_or(Reaction::Unreaded);
    let rss_feeds = match query.rss_source_uuid {
        Some(ref rss_source_uuid) => find_rss_feeds_by_rss_source(
            &connection,
            limit,
            offset,
            &reaction,
            rss_source_uuid,
            user,
        )?,
        None => find_rss_feeds(&connection, limit, offset, &reaction, user)?,
    };
    Ok(rss_feeds)
}

pub fn get_rss_feeds_service(
    pool: Data<DbPool>,
    config: Data<Config>,
    auth: Auth,
    query: Query<RssFeedsQuery>,
    pagination: Query<Pagination>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || {
        get_rss_feeds(
            &pool,
            &config,
            query.into_inner(),
            &pagination,
            &auth.claime.user,
        )
    })
    .and_then(|rss_feeds| {
        Ok(HttpResponse::Ok().json(
            rss_feeds
                .iter()
                .map(|(rss_feed, user_rss_feed)| {
                    json!({
                      "rss_feed": rss_feed,
                      "user_rss_feed": user_rss_feed,
                    })
                })
                .collect::<Vec<Value>>(),
        ))
    })
    .from_err()
}
