use actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Path, State};
use futures::future::Future;
use serde::Deserialize;
use uuid::Uuid;
use derive_new::new;

use crate::app::app_state::AppState;
use crate::app::db::DbExecutor;
use crate::errors::Error;
use crate::models::rss_source::RssSource;
use crate::repositories::rss_sources::find_by_uuid;

#[derive(Debug, new, Deserialize)]
pub struct GetRssSource {
    uuid: Uuid,
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
        })
        .responder()
}
