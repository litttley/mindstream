use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Path, State};
use diesel::Connection;
use futures::future::Future;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;
use derive_new::new;

use crate::app::app_state::AppState;
use crate::app::db::DbExecutor;
use crate::auth::auth::Auth;
use crate::errors::{ApiError, Error};
use crate::models::rss_source::RssSource;
use crate::models::user::User;
use crate::models::user_rss_source::UserRssSource;
use crate::repositories::rss_sources::find_by_uuid;
use crate::repositories::users_rss_sources::{insert, is_exists};

#[derive(Debug, new, Deserialize)]
pub struct FollowRssSource {
    rss_source_uuid: Uuid,
    user: User,
}

type ResultType = Result<(RssSource, UserRssSource), Error>;

impl Message for FollowRssSource {
    type Result = ResultType;
}

impl Handler<FollowRssSource> for DbExecutor {
    type Result = ResultType;

    fn handle(&mut self, message: FollowRssSource, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let rss_source_uuid = message.rss_source_uuid;
        let user = message.user;
        Ok(connexion.transaction::<_, Error, _>(|| {
            let rss_source = find_by_uuid(&connexion, &rss_source_uuid)?;
            let user_rss_source = UserRssSource::new(user.uuid, rss_source_uuid);
            let is_existe = is_exists(&connexion, &user_rss_source)?;
            if is_existe {
                Err(Error::BadRequest(ApiError::new("already.exist")))
            } else {
                let _ = insert(&connexion, &user_rss_source)?;
                Ok((rss_source, user_rss_source))
            }
        })?)
    }
}

pub fn follow_rss_source(
    (uuid, auth, state): (Path<Uuid>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(FollowRssSource::new(
            uuid.into_inner(),
            auth.claime.user,
        ))
        .from_err()
        .and_then(|res| match res {
            Ok((rss_source, user_rss_source)) => Ok(HttpResponse::Ok().json(json!({
                "rss_source": rss_source,
                "unreaded": user_rss_source.unreaded,
            }))),
            Err(err) => Err(err),
        })
        .responder()
}
