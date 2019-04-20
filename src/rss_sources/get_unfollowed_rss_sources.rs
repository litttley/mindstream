use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Query, State};
use futures::future::Future;
use serde::Deserialize;

use crate::app::app_state::AppState;
use crate::app::config;
use crate::app::db::DbExecutor;
use crate::auth::auth::Auth;
use crate::errors::Error;
use crate::models::pagination::Pagination;
use crate::models::rss_source::RssSource;
use crate::models::user::User;
use crate::repositories::users_rss_sources::find_unfollowed;

#[derive(Debug, Deserialize)]
pub struct GetUnfollowedRssSources {
    pub pagination: Pagination,
    pub user: User,
}

impl GetUnfollowedRssSources {
    pub const fn new(pagination: Pagination, user: User) -> Self {
        Self { pagination, user }
    }
}

impl Message for GetUnfollowedRssSources {
    type Result = Result<Vec<RssSource>, Error>;
}

impl Handler<GetUnfollowedRssSources> for DbExecutor {
    type Result = Result<Vec<RssSource>, Error>;

    fn handle(&mut self, message: GetUnfollowedRssSources, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let limit = message
            .pagination
            .limit
            .unwrap_or(config::CONFIG.default_limit);
        let offset = message.pagination.offset.unwrap_or(0);
        let user = message.user;
        let rss_source = find_unfollowed(&connexion, limit, offset, &user)?;
        Ok(rss_source)
    }
}

pub fn get_unfollowed_rss_sources(
    (pagination, auth, state): (Query<Pagination>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(GetUnfollowedRssSources::new(
            pagination.into_inner(),
            auth.claime.user,
        ))
        .from_err()
        .and_then(|res| match res {
            Ok(rss_sources) => Ok(HttpResponse::Ok().json(rss_sources)),
            Err(err) => Err(err),
        })
        .responder()
}
