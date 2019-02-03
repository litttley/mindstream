use actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Query, State};
use diesel::PgConnection;
use futures::future::Future;
use serde::Deserialize;
use url::Url;
use validator::Validate;
use validator_derive::Validate;

use crate::app::app_state::AppState;
use crate::app::db::DbExecutor;
use crate::errors::Error;
use crate::models::rss_source::RssSource;
use crate::repositories::rss_sources::{find_by_url, insert, search};
use crate::services::rss_service::fetch_feeds_channel;

#[derive(Debug, Validate, Deserialize)]
pub struct SearchRssSource {
    #[validate(length(min = "1"))]
    pub query: String,
}

type ResultType = Result<Vec<RssSource>, Error>;

impl Message for SearchRssSource {
    type Result = ResultType;
}

impl Handler<SearchRssSource> for DbExecutor {
    type Result = ResultType;

    fn handle(&mut self, message: SearchRssSource, _: &mut Self::Context) -> Self::Result {
        message.validate()?;
        let connection = self.pool.get()?;
        let query = &message.query;
        if Url::parse(query).is_ok() {
            find_rss_source_by_url(&connection, query)
        } else {
            Ok(search(&connection, query)?)
        }
    }
}

fn find_rss_source_by_url(connection: &PgConnection, url: &str) -> Result<Vec<RssSource>, Error> {
    if let Ok(rss_source) = find_by_url(connection, url) {
        Ok(vec![rss_source])
    } else if let Ok(Some(rss_feed)) = fetch_feeds_channel(url) {
        let rss_source = RssSource::from_feed(url, rss_feed);
        insert(connection, &rss_source)?;
        Ok(vec![rss_source])
    } else {
        Ok(vec![])
    }
}

pub fn search_rss_source_handler(
    (search_rss_source, state): (Query<SearchRssSource>, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(search_rss_source.into_inner())
        .from_err()
        .and_then(|res| match res {
            Ok(rss_sources) => Ok(HttpResponse::Ok().json(rss_sources)),
            Err(err) => Err(err),
        })
        .responder()
}
