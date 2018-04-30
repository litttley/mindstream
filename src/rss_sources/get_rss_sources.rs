use actix::prelude::*;
use actix_web::{State, Query, HttpResponse, AsyncResponder};
use futures::future::Future;

use errors::Error;
use app::app_state::AppState;
use app::db::DbExecutor;
use app::config;
use rss_sources::rss_source::RssSource;
use rss_sources::rss_sources_repository::find_rss_sources;
use pagination::Pagination;

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
        let limit = message.pagination.limit.unwrap_or(config::CONFIG.default_limit);
        let offset = message.pagination.offset.unwrap_or(0);
        let rss_source = find_rss_sources(&connexion, limit, offset)?;
        Ok(rss_source)
    }
}

pub fn get_rss_sources(pagination: Query<Pagination>, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=Error>> {
    state.db
        .send(GetRssSources::new(pagination.into_inner()))
        .from_err()
        .and_then(|res| {
            match res {
                Ok(rss_sources) => Ok(HttpResponse::Ok().json(rss_sources)),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}
