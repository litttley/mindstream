use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Query, State};
use futures::future::Future;
use serde::Deserialize;

use crate::app::app_state::AppState;
use crate::app::config;
use crate::app::db::DbExecutor;
use crate::errors::Error;
use crate::models::pagination::Pagination;
use crate::models::rss_source::RssSource;
use crate::repositories::rss_sources::find_rss_sources;

#[derive(Debug, Deserialize)]
pub struct GetRssSources {
    pub pagination: Pagination,
}

impl GetRssSources {
    pub fn new(pagination: Pagination) -> Self {
        Self { pagination }
    }
}

impl Message for GetRssSources {
    type Result = Result<Vec<RssSource>, Error>;
}

impl Handler<GetRssSources> for DbExecutor {
    type Result = Result<Vec<RssSource>, Error>;

    fn handle(&mut self, message: GetRssSources, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let limit = message
            .pagination
            .limit
            .unwrap_or(config::CONFIG.default_limit);
        let offset = message.pagination.offset.unwrap_or(0);
        let rss_source = find_rss_sources(&connexion, limit, offset)?;
        Ok(rss_source)
    }
}

pub fn get_rss_sources(
    (pagination, state): (Query<Pagination>, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(GetRssSources::new(pagination.into_inner()))
        .from_err()
        .and_then(|res| match res {
            Ok(rss_sources) => Ok(HttpResponse::Ok().json(rss_sources)),
            Err(err) => Err(err),
        })
        .responder()
}
