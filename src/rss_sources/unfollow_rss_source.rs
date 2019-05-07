use actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Path, State};
use futures::future::Future;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;
use derive_new::new;

use crate::app::app_state::AppState;
use crate::app::db::DbExecutor;
use crate::auth::Auth;
use crate::errors::Error;
use crate::models::user::User;
use crate::repositories::users_rss_sources::delete;

#[derive(Debug, new, Deserialize)]
pub struct UnfollowRssSource {
    user_rss_source_uuid: Uuid,
    user: User,
}

type ResultType = Result<usize, Error>;

impl Message for UnfollowRssSource {
    type Result = ResultType;
}

impl Handler<UnfollowRssSource> for DbExecutor {
    type Result = ResultType;

    fn handle(&mut self, message: UnfollowRssSource, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let user_rss_source_uuid = message.user_rss_source_uuid;
        let user = message.user;
        Ok(delete(&connexion, &user_rss_source_uuid, &user)?)
    }
}

pub fn unfollow_rss_source(
    (uuid, auth, state): (Path<Uuid>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(UnfollowRssSource::new(
            uuid.into_inner(),
            auth.claime.user,
        ))
        .from_err()
        .and_then(|res| match res {
            Ok(r) => Ok(HttpResponse::Ok().json(json!({
                "result": if r > 0 { true } else { false }
            }))),
            Err(err) => Err(err),
        })
        .responder()
}
