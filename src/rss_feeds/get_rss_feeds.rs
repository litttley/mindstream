use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Query, State};
use futures::future::Future;
use serde::Deserialize;
use serde_json;
use serde_json::json;
use uuid::Uuid;

use crate::app::app_state::AppState;
use crate::app::config;
use crate::app::db::DbExecutor;
use crate::auth::auth::Auth;
use crate::errors::Error;
use crate::models::rss_feeds_reaction::RssFeedsReaction;
use crate::models::rss_feed::RssFeed;
use crate::models::user::User;
use crate::models::user_rss_feed::UserRssFeed;
use crate::repositories::users_rss_feeds::{find_rss_feeds, find_rss_feeds_by_rss_source};

#[derive(Debug, Deserialize)]
pub struct RssFeedsQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub rss_source_uuid: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct GetRssFeeds {
    pub user: User,
    pub query: RssFeedsQuery,
    pub reaction_query: RssFeedsReaction,
}

impl GetRssFeeds {
    pub fn new(query: RssFeedsQuery, reaction_query: RssFeedsReaction, user: User) -> Self {
        Self { query, reaction_query, user }
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
        let reaction_query = message.reaction_query;
        let rss_feeds = match message.query.rss_source_uuid {
            Some(rss_source_uuid) => find_rss_feeds_by_rss_source(
                &connexion,
                limit,
                offset,
                &rss_source_uuid,
                &user,
            )?,
            None => find_rss_feeds(&connexion, limit, offset, &user, &reaction_query)?,
        };
        Ok(rss_feeds)
    }
}

pub fn get_rss_feeds(
    (query, reaction_query, auth, state): (Query<RssFeedsQuery>, Query<RssFeedsReaction>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(GetRssFeeds::new(
            query.into_inner(),
            reaction_query.into_inner(),
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
