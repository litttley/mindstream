use actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Path, State};
use diesel::Connection;
use futures::future::Future;
use uuid::Uuid;

use app::app_state::AppState;
use app::db::DbExecutor;
use auth::auth::Auth;
use errors::{ApiError, Error};
use rss_sources::rss_source::RssSource;
use rss_sources::rss_sources_repository::find_by_uuid;
use rss_sources::user_rss_source::UserRssSource;
use rss_sources::users_rss_sources_repository::{insert, is_exists};
use users::user::User;

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
                Err(Error::BadRequest(ApiError::new("already.exist")).into())
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
        )).from_err()
        .and_then(|res| match res {
            Ok(rss_source) => Ok(HttpResponse::Ok().json(rss_source)),
            Err(err) => Err(err.into()),
        }).responder()
}
