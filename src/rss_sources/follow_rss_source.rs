use actix_web::web::{block, Data, HttpResponse, Path};
use diesel::Connection;
use futures::future::Future;
use serde_json::json;
use uuid::Uuid;

use crate::auth::Auth;
use crate::db::DbPool;
use crate::errors::{ApiError, AppError};
use crate::models::{RssSource, User, UserRssSource};
use crate::repositories::rss_sources::find_by_uuid;
use crate::repositories::users_rss_sources::{insert, is_exists};

fn follow_rss_source(
    pool: &DbPool,
    rss_source_uuid: Uuid,
    user: &User,
) -> Result<(RssSource, UserRssSource), AppError> {
    let connection = pool.get()?;
    Ok(connection.transaction::<_, AppError, _>(|| {
        let rss_source = find_by_uuid(&connection, &rss_source_uuid)?;
        let user_rss_source = UserRssSource::new(user.uuid, rss_source_uuid);
        let is_existe = is_exists(&connection, &user_rss_source)?;
        if is_existe {
            Err(AppError::BadRequest(ApiError::new("already.exist")))
        } else {
            let _ = insert(&connection, &user_rss_source)?;
            Ok((rss_source, user_rss_source))
        }
    })?)
}

pub fn follow_rss_source_service(
    pool: Data<DbPool>,
    uuid: Path<Uuid>,
    auth: Auth,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || follow_rss_source(&pool, uuid.into_inner(), &auth.claime.user))
        .and_then(|(rss_source, user_rss_source)| {
            Ok(HttpResponse::Ok().json(json!({
                "rss_source": rss_source,
                "unreaded": user_rss_source.unreaded,
            })))
        })
        .from_err()
}
