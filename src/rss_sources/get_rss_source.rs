use actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Path, State};
use futures::future::Future;
use uuid::Uuid;
use serde_derive::Deserialize;

use app::app_state::AppState;
use app::db::DbExecutor;
use errors::Error;
use rss_sources::rss_source::RssSource;
use rss_sources::rss_sources_repository::find_by_uuid;

#[derive(Debug, Deserialize)]
pub struct GetRssSource {
    uuid: Uuid,
}

impl GetRssSource {
    pub fn new(uuid: Uuid) -> Self {
        Self { uuid }
    }
}

impl Message for GetRssSource {
    type Result = Result<RssSource, Error>;
}

impl Handler<GetRssSource> for DbExecutor {
    type Result = Result<RssSource, Error>;

    fn handle(&mut self, message: GetRssSource, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let rss_source_uuid = message.uuid;
        let rss_source = find_by_uuid(&connexion, &rss_source_uuid)?;
        Ok(rss_source)
    }
}

pub fn get_rss_source(
    (uuid, state): (Path<Uuid>, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(GetRssSource::new(uuid.into_inner()))
        .from_err()
        .and_then(|res| match res {
            Ok(rss_source) => Ok(HttpResponse::Ok().json(rss_source)),
            Err(err) => Err(err),
        }).responder()
}
