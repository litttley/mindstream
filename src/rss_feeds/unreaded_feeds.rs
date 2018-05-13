use actix::prelude::*;
use actix_web::{State, Query, HttpResponse, AsyncResponder};
use futures::future::Future;

use errors::Error;
use auth::auth::Auth;
use app::app_state::AppState;
use app::db::DbExecutor;
use users::user::User;
use app::config;
use rss_feeds::rss_feed::RssFeed;
use rss_feeds::users_rss_feeds_repository::find_unreaded_feeds;
use rss_feeds::users_rss_feeds_repository::find_unreaded_feeds_by_rss_source;
use pagination::PaginationWithRssSourceUuid;

#[derive(Debug, Deserialize)]
pub struct UnreadedRssFeeds {
    pub user: User,
    pub pagination: PaginationWithRssSourceUuid,
}

impl UnreadedRssFeeds {
    pub fn new(pagination: PaginationWithRssSourceUuid, user: User) -> Self {
        Self { pagination, user }
    }
}

impl Message for UnreadedRssFeeds {
    type Result = Result<Vec<RssFeed>, Error>;
}

impl Handler<UnreadedRssFeeds> for DbExecutor {
    type Result = Result<Vec<RssFeed>, Error>;

    fn handle(&mut self, message: UnreadedRssFeeds, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let limit = message.pagination.limit.unwrap_or(config::CONFIG.default_limit);
        let offset = message.pagination.offset.unwrap_or(0);
        let user = message.user;
        let rss_feeds = match message.pagination.rss_source_uuid {
            Some(rss_source_uuid) => {
                info!("UnreadedRssFeeds {}", rss_source_uuid);
                find_unreaded_feeds_by_rss_source(&connexion, limit, offset, &rss_source_uuid, &user)?
            },
            None => {
                find_unreaded_feeds(&connexion, limit, offset, &user)?
            }
        };
        Ok(rss_feeds)
    }
}

pub fn unreaded_feeds(pagination: Query<PaginationWithRssSourceUuid>, auth: Auth, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=Error>> {
    state.db
        .send(UnreadedRssFeeds::new(pagination.into_inner(), auth.claime.user.clone()))
        .from_err()
        .and_then(|res| {
            match res {
                Ok(rss_feeds) => Ok(HttpResponse::Ok().json(rss_feeds)),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}
