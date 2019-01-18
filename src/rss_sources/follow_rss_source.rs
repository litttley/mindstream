use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Path, State};
use diesel::Connection;
use futures::future::Future;
use serde::Deserialize;
use uuid::Uuid;

use crate::app::app_state::AppState;
use crate::app::db::DbExecutor;
use crate::auth::auth::Auth;
use crate::errors::{ApiError, Error};
use crate::models::rss_source::RssSource;
use crate::rss_sources::rss_sources_repository::find_by_uuid;
use crate::models::user_rss_source::UserRssSource;
use crate::rss_sources::users_rss_sources_repository::{insert, is_exists};
use crate::users::user::User;

#[derive(Debug, Deserialize)]
pub struct FallowRssSource {
    rss_source_uuid: Uuid,
    user: User,
}

impl FallowRssSource {
    pub fn new(rss_source_uuid: Uuid, user: User) -> Self {
        FallowRssSource {
            rss_source_uuid,
            user,
        }
    }
}

impl Message for FallowRssSource {
    type Result = Result<RssSource, Error>;
}

impl Handler<FallowRssSource> for DbExecutor {
    type Result = Result<RssSource, Error>;

    fn handle(&mut self, message: FallowRssSource, _: &mut Self::Context) -> Self::Result {
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
                Ok(rss_source)
            }
        })?)
    }
}

pub fn follow_rss_source(
    (uuid, auth, state): (Path<Uuid>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(FallowRssSource::new(
            uuid.into_inner(),
            auth.claime.user.clone(),
        ))
        .from_err()
        .and_then(|res| match res {
            Ok(rss_source) => Ok(HttpResponse::Ok().json(rss_source)),
            Err(err) => Err(err),
        })
        .responder()
}
