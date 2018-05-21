use uuid::Uuid;
use actix::prelude::*;
use actix_web::{State, Json, HttpResponse, AsyncResponder};
use futures::future::Future;

use errors::Error;
use auth::auth::Auth;
use app::app_state::AppState;
use app::db::DbExecutor;
use users::user::User;
use rss_feeds::users_rss_feeds_repository::{update_rss_feed_reaction, find_user_rss_feed};
use rss_feeds::rss_feeds_repository::find_rss_feed;
use rss_feeds::user_rss_feed::{Reaction, UserRssFeed};
use rss_sources::users_rss_sources_repository::decrement_unreaded_rss_sources;

#[derive(Debug, Deserialize)]
pub struct ChangeRssFeedReactionQuery {
    pub rss_feed_uuid: Uuid,
    pub reaction: Reaction,
}

#[derive(Debug, Deserialize)]
pub struct ChangeRssFeedReaction {
    pub user: User,
    pub query: ChangeRssFeedReactionQuery,
}

impl ChangeRssFeedReaction {
    pub fn new(query: ChangeRssFeedReactionQuery, user: User) -> Self {
        Self { query, user }
    }
}

impl Message for ChangeRssFeedReaction {
    type Result = Result<UserRssFeed, Error>;
}

impl Handler<ChangeRssFeedReaction> for DbExecutor {
    type Result = Result<UserRssFeed, Error>;

    fn handle(&mut self, message: ChangeRssFeedReaction, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let user = message.user;
        let reaction = message.query.reaction;
        let rss_feed_uuid = message.query.rss_feed_uuid;
        let rss_feed = find_rss_feed(&connexion, &rss_feed_uuid)?;
        let user_rss_feed = find_user_rss_feed(&connexion, &rss_feed_uuid, &user)?;
        match user_rss_feed.reaction.as_ref() {
            "Unreaded" => {
                let rss_feeds = update_rss_feed_reaction(&connexion, &rss_feed_uuid, &reaction, &user)?;
                let _ = decrement_unreaded_rss_sources(&connexion, &rss_feed.rss_source_uuid, &user)?;
                Ok(rss_feeds)
            },
            _ => {
                let rss_feeds = update_rss_feed_reaction(&connexion, &rss_feed_uuid, &reaction, &user)?;
                Ok(rss_feeds)
            }
        }
    }
}

pub fn change_rss_feed_reaction(json: Json<ChangeRssFeedReactionQuery>, auth: Auth, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=Error>> {
    state.db
        .send(ChangeRssFeedReaction::new(json.into_inner(), auth.claime.user.clone()))
        .from_err()
        .and_then(|res| {
            match res {
                Ok(rss_feeds) => Ok(HttpResponse::Ok().json(rss_feeds)),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}
