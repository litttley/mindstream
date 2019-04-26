use actix::prelude::*;
use actix_web::{AsyncResponder, HttpResponse, Json, State, Path};
use futures::future::Future;
use serde::Deserialize;
use uuid::Uuid;
use derive_new::new;

use crate::app::app_state::AppState;
use crate::app::db::DbExecutor;
use crate::auth::Auth;
use crate::errors::Error;
use crate::models::user::User;
use crate::models::user_rss_feed::UserRssFeed;
use crate::models::rss_feeds_reaction::RssFeedsReaction;
use crate::repositories::{
    rss_feeds::find_rss_feed,
    users_rss_feeds::{find_user_rss_feed, update_rss_feed_reaction},
    users_rss_sources::decrement_unreaded_rss_sources,
};

#[derive(Debug, new, Deserialize)]
pub struct ChangeRssFeedReaction {
    pub rss_feed_uuid: Uuid,
    pub reaction: RssFeedsReaction,
    pub user: User,
}

impl Message for ChangeRssFeedReaction {
    type Result = Result<UserRssFeed, Error>;
}

impl Handler<ChangeRssFeedReaction> for DbExecutor {
    type Result = Result<UserRssFeed, Error>;

    fn handle(&mut self, message: ChangeRssFeedReaction, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let user = message.user;
        let reaction = message.reaction;
        let rss_feed_uuid = message.rss_feed_uuid;
        let rss_feed = find_rss_feed(&connexion, &rss_feed_uuid)?;
        let user_rss_feed = find_user_rss_feed(&connexion, &rss_feed_uuid, &user)?;
        let rss_feeds = update_rss_feed_reaction(&connexion, &rss_feed_uuid, &reaction, &user)?;
        if user_rss_feed.viewed {
            let _ = decrement_unreaded_rss_sources(&connexion, &rss_feed.rss_source_uuid, &user)?;
        }
        Ok(rss_feeds)
    }
}

pub fn change_rss_feed_reaction(
    (rss_feed_uuid, reaction, auth, state): (Path<Uuid>, Json<RssFeedsReaction>, Auth, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    state
        .db
        .send(ChangeRssFeedReaction::new(
            rss_feed_uuid.into_inner(),
            reaction.into_inner(),
            auth.claime.user,
        ))
        .from_err()
        .and_then(|res| match res {
            Ok(rss_feeds) => Ok(HttpResponse::Ok().json(rss_feeds)),
            Err(err) => Err(err),
        })
        .responder()
}
