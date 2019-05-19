use actix_web::web::{block, Data, HttpResponse, Path};
use futures::future::Future;
use serde_json::json;
use uuid::Uuid;

use crate::auth::Auth;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::User;
use crate::repositories::users_rss_sources::delete;

fn unfollow_rss_source(pool: &DbPool, uuid: Uuid, user: &User) -> Result<usize, AppError> {
    let connection = pool.get()?;
    Ok(delete(&connection, &uuid, user)?)
}

pub fn unfollow_rss_source_service(
    pool: Data<DbPool>,
    uuid: Path<Uuid>,
    auth: Auth,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || unfollow_rss_source(&pool, uuid.into_inner(), &auth.claime.user))
        .and_then(|result| Ok(HttpResponse::Ok().json(json!({ "result": result > 0 }))))
        .from_err()
}
