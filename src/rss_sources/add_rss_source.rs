use actix_web::web::{block, Data, HttpResponse, Json};
use futures::future::Future;
use serde::Deserialize;
use validator::Validate;
use validator_derive::Validate;

use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::RssSource;
use crate::repositories::rss_sources::insert;
use crate::services::rss_service::fetch_feeds_channel;

#[derive(Debug, Validate, Deserialize)]
pub struct AddRssSource {
    #[validate(url(message = "validation.url"))]
    url: String,
}

fn add_rss_source(pool: &DbPool, payload: AddRssSource) -> Result<RssSource, AppError> {
    payload.validate()?;
    let url = payload.url;
    let rss_feed = fetch_feeds_channel(&url)?;
    let rss_feed = rss_feed.ok_or_else(|| AppError::NotFound)?;
    let rss_source = RssSource::from_feed(&url, rss_feed);
    let connection = pool.get()?;
    let rss_source = insert(&connection, &rss_source)?;
    Ok(rss_source)
}

pub fn add_rss_source_service(
    pool: Data<DbPool>,
    payload: Json<AddRssSource>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || add_rss_source(&pool, payload.into_inner()))
        .and_then(|rss_source| Ok(HttpResponse::Ok().json(rss_source)))
        .from_err()
}
