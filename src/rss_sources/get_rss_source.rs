use uuid::Uuid;
use actix::prelude::*;
use actix_web::{State, Path, HttpResponse, AsyncResponder};
use futures::future::Future;

use errors::Error;
use app::app_state::AppState;
use app::db::DbExecutor;
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

pub fn get_rss_source(uuid: Path<Uuid>, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=Error>> {
    state.db
        .send(GetRssSource::new(uuid.into_inner()))
        .from_err()
        .and_then(|res| {
            match res {
                Ok(rss_source) => Ok(HttpResponse::Ok().json(rss_source)),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}