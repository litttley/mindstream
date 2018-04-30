use actix::prelude::*;
use actix_web::{State, Query, HttpResponse, AsyncResponder};
use futures::future::Future;

use errors::Error;
use auth::auth::Auth;
use app::app_state::AppState;
use app::db::DbExecutor;
use app::config;
use users::user::User;
use rss_sources::rss_source::RssSource;
use rss_sources::users_rss_sources_repository::rss_sources_by_user;
use pagination::Pagination;

#[derive(Debug, Deserialize)]
pub struct MyRssSources {
    pagination: Pagination,
    user: User,
}

impl MyRssSources {
    pub fn new(pagination: Pagination, user: User) -> Self {
        Self { pagination, user }
    }
}

impl Message for MyRssSources {
    type Result = Result<Vec<RssSource>, Error>;
}

impl Handler<MyRssSources> for DbExecutor {
    type Result = Result<Vec<RssSource>, Error>;

    fn handle(&mut self, message: MyRssSources, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let limit = message.pagination.limit.unwrap_or(config::CONFIG.default_limit);
        let offset = message.pagination.offset.unwrap_or(0);
        let user = message.user;
        let rss_source = rss_sources_by_user(&connexion, limit, offset, &user)?;
        Ok(rss_source)
    }
}

pub fn my_rss_sources(pagination: Query<Pagination>, auth: Auth, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=Error>> {
    state.db
        .send(MyRssSources::new(pagination.into_inner(), auth.claime.user.clone()))
        .from_err()
        .and_then(|res| {
            match res {
                Ok(rss_sources) => Ok(HttpResponse::Ok().json(rss_sources)),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}

