use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Json, State};
use futures::future::Future;
use serde::Deserialize;
use validator::Validate;
use validator_derive::Validate;

use crate::app::app_state::AppState;
use crate::app::db::DbExecutor;
use crate::errors::Error;
use crate::rss_sources::rss_service::fetch_feeds_channel;
use crate::models::rss_source::RssSource;
use crate::repositories::rss_sources::insert;

#[derive(Debug, Validate, Deserialize)]
pub struct AddRssSource {
    #[validate(url(message = "validation.url"))]
    url: String,
}

impl Message for AddRssSource {
    type Result = Result<RssSource, Error>;
}

impl Handler<AddRssSource> for DbExecutor {
    type Result = Result<RssSource, Error>;

    fn handle(&mut self, message: AddRssSource, _: &mut Self::Context) -> Self::Result {
        message.validate()?;
        let url = message.url;
        let rss_feed = fetch_feeds_channel(&url)?;
        let rss_feed = rss_feed.ok_or_else(|| Error::NotFound)?;
        let rss_source = RssSource::from_feed(&url, rss_feed);
        let connexion = self.pool.get()?;
        let rss_source = insert(&connexion, &rss_source)?;
        Ok(rss_source)
    }
}

pub fn add_rss_source(
    (add_rss_source, state): (Json<AddRssSource>, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(add_rss_source.0)
        .from_err()
        .and_then(|res| match res {
            Ok(rss_source) => Ok(HttpResponse::Ok().json(rss_source)),
            Err(err) => Err(err),
        })
        .responder()
}
