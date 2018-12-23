use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Query, State};
use futures::future::Future;
use log::debug;
use serde_derive::Deserialize;
use serde_json;
use serde_json::json;
use uuid::Uuid;

use crate::app::app_state::AppState;
use crate::app::config;
use crate::app::db::DbExecutor;
use crate::auth::auth::Auth;
use crate::errors::Error;
use crate::rss_feeds::rss_feed::RssFeed;
use crate::rss_feeds::user_rss_feed::{Reaction, UserRssFeed};
use crate::rss_feeds::users_rss_feeds_repository::find_rss_feeds;
use crate::rss_feeds::users_rss_feeds_repository::find_rss_feeds_by_rss_source;
use crate::users::user::User;

#[derive(Debug, Deserialize)]
pub struct RssFeedsQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub rss_source_uuid: Option<Uuid>,
    pub reaction: Option<Reaction>,
}

#[derive(Debug, Deserialize)]
pub struct GetRssFeeds {
    pub user: User,
    pub query: RssFeedsQuery,
}

impl GetRssFeeds {
    pub fn new(query: RssFeedsQuery, user: User) -> Self {
        Self { query, user }
    }
}

impl Message for GetRssFeeds {
    type Result = Result<Vec<(RssFeed, UserRssFeed)>, Error>;
}

impl Handler<GetRssFeeds> for DbExecutor {
    type Result = Result<Vec<(RssFeed, UserRssFeed)>, Error>;

    fn handle(&mut self, message: GetRssFeeds, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let limit = message.query.limit.unwrap_or(config::CONFIG.default_limit);
        let offset = message.query.offset.unwrap_or(0);
        let user = message.user;
        let reaction = message.query.reaction.unwrap_or(Reaction::Unreaded);
        debug!("GetRssFeeds {:?}", reaction);
        let rss_feeds = match message.query.rss_source_uuid {
            Some(rss_source_uuid) => find_rss_feeds_by_rss_source(
                &connexion,
                limit,
                offset,
                &reaction,
                &rss_source_uuid,
                &user,
            )?,
            None => find_rss_feeds(&connexion, limit, offset, &reaction, &user)?,
        };
        Ok(rss_feeds)
    }
}

pub fn get_rss_feeds(
    (query, auth, state): (Query<RssFeedsQuery>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(GetRssFeeds::new(
            query.into_inner(),
            auth.claime.user.clone(),
        ))
        .from_err()
        .and_then(|res| match res {
            Ok(rss_feeds) => Ok(HttpResponse::Ok().json(
                rss_feeds
                    .iter()
                    .map(|(rss_feed, user_rss_feed)| {
                        json!({
                          "rss_feed": rss_feed,
                          "user_rss_feed": user_rss_feed,
                        })
                    })
                    .collect::<serde_json::Value>(),
            )),
            Err(err) => Err(err),
        })
        .responder()
}
