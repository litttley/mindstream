use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Query, State};
use futures::future::Future;
use serde::Deserialize;
use serde_json::{json, Value};
use derive_new::new;

use crate::app::app_state::AppState;
use crate::app::config;
use crate::app::db::DbExecutor;
use crate::auth::auth::Auth;
use crate::errors::Error;
use crate::models::pagination::Pagination;
use crate::models::rss_source::RssSource;
use crate::models::user::User;
use crate::models::user_rss_source::UserRssSource;
use crate::repositories::users_rss_sources::rss_sources_by_user;

#[derive(Debug, new, Deserialize)]
pub struct MyRssSources {
    user: User,
    pagination: Pagination,
}

impl Message for MyRssSources {
    type Result = Result<Vec<(RssSource, UserRssSource)>, Error>;
}

impl Handler<MyRssSources> for DbExecutor {
    type Result = Result<Vec<(RssSource, UserRssSource)>, Error>;

    fn handle(&mut self, message: MyRssSources, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let limit = message
            .pagination
            .limit
            .unwrap_or(config::CONFIG.default_limit);
        let offset = message.pagination.offset.unwrap_or(0);
        let user = message.user;
        let rss_source = rss_sources_by_user(&connexion, limit, offset, &user)?;
        Ok(rss_source)
    }
}

pub fn my_rss_sources(
    (pagination, auth, state): (Query<Pagination>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(MyRssSources::new(
            auth.claime.user,
            pagination.into_inner(),
        ))
        .from_err()
        .and_then(|res| match res {
            Ok(rss_sources) => Ok(HttpResponse::Ok().json(
                rss_sources
                    .iter()
                    .map(|(rss_source, user_rss_source)| {
                        json!({
                            "rss_source": rss_source,
                            "unreaded": user_rss_source.unreaded,
                        })
                    })
                    .collect::<Vec<Value>>(),
            )),
            Err(err) => Err(err),
        })
        .responder()
}
