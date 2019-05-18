use actix_web::web::{block, Data, HttpResponse, Path};
use futures::future::Future;
use uuid::Uuid;

use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::RssSource;
use crate::repositories::rss_sources::find_by_uuid;

fn get_rss_source(pool: &DbPool, uuid: Uuid) -> Result<RssSource, AppError> {
    let connection = pool.get()?;
    let rss_source = find_by_uuid(&connection, &uuid)?;
    Ok(rss_source)
}

pub fn get_rss_source_service(
    pool: Data<DbPool>,
    uuid: Path<Uuid>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || get_rss_source(&pool, uuid.into_inner()))
        .and_then(|rss_source| Ok(HttpResponse::Ok().json(rss_source)))
        .from_err()
}
