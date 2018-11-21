use actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Json, State};
use futures::future::Future;
use validator::Validate;
use serde_derive::Deserialize;

use app::app_state::AppState;
use app::db::DbExecutor;
use errors::Error;
use rss_sources::rss_service::fetch_feeds_channel;
use rss_sources::rss_source::RssSource;
use rss_sources::rss_sources_repository::insert;

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
        let rss_source = RssSource::new(
            &url,
            &rss_feed.title.unwrap_or_else(|| url.to_owned()),
            &rss_feed.website.unwrap_or_else(|| url.to_owned()),
            rss_feed.description,
            rss_feed.language,
            rss_feed.icon_url,
            rss_feed.cover_url,
            rss_feed.visual_url,
            rss_feed.topics,
            rss_feed.last_updated,
        );
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
        }).responder()
}
