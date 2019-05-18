use actix_web::web::{block, Data, HttpResponse, Json};
use futures::future::Future;
use serde::Deserialize;
use uuid::Uuid;

use crate::auth::Auth;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::{Reaction, User, UserRssFeed};
use crate::repositories::{
    rss_feeds::find_rss_feed,
    users_rss_feeds::{find_user_rss_feed, update_rss_feed_reaction},
    users_rss_sources::decrement_unreaded_rss_sources,
};

#[derive(Debug, Deserialize)]
pub struct ChangeRssFeedReactionQuery {
    pub rss_feed_uuid: Uuid,
    pub reaction: Reaction,
}

fn change_rss_feed_reaction(
    pool: &DbPool,
    query: &ChangeRssFeedReactionQuery,
    user: &User,
) -> Result<UserRssFeed, AppError> {
    let connection = pool.get()?;
    let reaction = &query.reaction;
    let rss_feed_uuid = query.rss_feed_uuid;
    let rss_feed = find_rss_feed(&connection, &rss_feed_uuid)?;
    let user_rss_feed = find_user_rss_feed(&connection, &rss_feed_uuid, user)?;
    if user_rss_feed.reaction == "Unreaded" {
        let rss_feeds = update_rss_feed_reaction(&connection, &rss_feed_uuid, reaction, user)?;
        let _ = decrement_unreaded_rss_sources(&connection, &rss_feed.rss_source_uuid, user)?;
        Ok(rss_feeds)
    } else {
        let rss_feeds = update_rss_feed_reaction(&connection, &rss_feed_uuid, reaction, user)?;
        Ok(rss_feeds)
    }
}

pub fn change_rss_feed_reaction_service(
    pool: Data<DbPool>,
    query: Json<ChangeRssFeedReactionQuery>,
    auth: Auth,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || change_rss_feed_reaction(&pool, &query, &auth.claime.user))
        .and_then(|rss_feeds| Ok(HttpResponse::Ok().json(rss_feeds)))
        .from_err()
}
