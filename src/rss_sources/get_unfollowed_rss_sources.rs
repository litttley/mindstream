use actix::prelude::*;
use actix_web::{State, Query, HttpResponse, AsyncResponder};
use futures::future::Future;

use users::user::User;
use errors::Error;
use auth::auth::Auth;
use app::app_state::AppState;
use app::db::DbExecutor;
use app::config;
use rss_sources::rss_source::RssSource;
use rss_sources::users_rss_sources_repository::find_unfollowed;
use pagination::Pagination;

#[derive(Debug, Deserialize)]
pub struct GetUnfollowedRssSources {
    pub pagination: Pagination,
    pub user: User,
}

impl GetUnfollowedRssSources {
    pub fn new(pagination: Pagination, user: User) -> Self {
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
        let limit = message.pagination.limit.unwrap_or(config::CONFIG.default_limit);
        let offset = message.pagination.offset.unwrap_or(0);
        let user = message.user;
        let rss_source = find_unfollowed(&connexion, limit, offset, &user)?;
        Ok(rss_source)
    }
}

pub fn get_unfollowed_rss_sources((pagination, auth, state): (Query<Pagination>, Auth, State<AppState>)) -> Box<Future<Item=HttpResponse, Error=Error>> {
    state.db
        .send(GetUnfollowedRssSources::new(pagination.into_inner(), auth.claime.user.clone()))
        .from_err()
        .and_then(|res| {
            match res {
                Ok(rss_sources) => Ok(HttpResponse::Ok().json(rss_sources)),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}

