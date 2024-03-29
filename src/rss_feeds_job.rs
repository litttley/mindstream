use diesel::{Connection, PgConnection};
use log::{error, info};
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;
use reqwest::Client;
use std::thread;
use std::time::Duration;
use url::Url;

use crate::config::Config;
use crate::errors::AppError;
use crate::models::{RssFeed, RssSource, User, UserRssFeed};
use crate::repositories::{
    rss_feeds::{insert_rss_feed, is_rss_feed_exists},
    rss_sources::find_rss_sources,
    users_rss_feeds::{insert_user_rss_feed, is_user_feed_already_inserted},
    users_rss_sources::{find_rss_source_subscribers, increment_unreaded_rss_sources},
};
use crate::services::readable::fetch_readable;
use crate::services::rss_service::fetch_feeds_channel;

pub fn run_rss_job(pool: Pool<ConnectionManager<PgConnection>>, config: Config) {
    let client = Client::new();
    let rss_job_interval = config.rss_job_interval;
    thread::spawn(move || loop {
        if let Err(err) = process_feeds(&pool, &config, &client) {
            error!("process_rss error {:?}", err);
        }
        thread::sleep(Duration::from_secs(rss_job_interval));
    });
}

fn process_feeds(
    pool: &Pool<ConnectionManager<PgConnection>>,
    config: &Config,
    client: &Client,
) -> Result<(), AppError> {
    let connection = pool.get()?;
    let rss_sources = find_rss_sources(&connection, i64::max_value(), 0)?;
    for rss_source in rss_sources {
        let subscribers = find_rss_source_subscribers(&connection, &rss_source)?;
        process_rss_source(&connection, config, &subscribers, &rss_source, client)?;
    }
    Ok(())
}

fn process_rss_source(
    connection: &PgConnection,
    config: &Config,
    subscribers: &[User],
    rss_source: &RssSource,
    client: &Client,
) -> Result<(), AppError> {
    match fetch_feeds_channel(&rss_source.url) {
        Ok(Some(feeds_channel)) => {
            for rss in &feeds_channel.entries {
                for link in &rss.alternate {
                    let rss_url = link.href.clone();
                    let resolved_url = resolve_url(&rss_url, client).map(Url::into_string);
                    if !is_rss_feed_exists(connection, &rss_url)? {
                        let readable = fetch_readable(client, config, &rss_url)
                            .ok()
                            .and_then(|readable| readable)
                            .filter(|readable| !readable.is_empty());
                        let rss_feed = RssFeed::new(
                            rss_url,
                            resolved_url,
                            Some(rss.clone().into()),
                            readable,
                            rss_source,
                        );
                        insert_rss_feed(connection, &rss_feed)?;
                        // TODO rollback if error
                        insert_subscribers_feeds(connection, subscribers, rss_source, &rss_feed)?;
                    }
                }
            }
        }
        Err(error) => error!("{}", error),
        _ => (),
    }
    Ok(())
}

fn resolve_url(url: &str, client: &Client) -> Option<Url> {
    client.get(url).send().ok().and_then(|response| {
        if response.status().is_success() {
            Some(response.url().clone())
        } else {
            None
        }
    })
}

fn insert_subscribers_feeds(
    connection: &PgConnection,
    subscribers: &[User],
    rss_source: &RssSource,
    rss_feed: &RssFeed,
) -> Result<(), AppError> {
    for subscriber in subscribers {
        let user_feed = UserRssFeed::new(subscriber.uuid, rss_feed.uuid, "Unreaded".to_owned());
        let _ = connection.transaction::<_, AppError, _>(|| {
            if !is_user_feed_already_inserted(connection, &rss_feed.rss_url, subscriber)? {
                insert_user_rss_feed(connection, &user_feed)?;
                increment_unreaded_rss_sources(connection, rss_source, subscriber)?;
                info!(
                    "insert subscriber {:?} -> {:?}",
                    subscriber.login, &rss_feed.rss_url
                );
            }
            Ok(())
        });
    }
    Ok(())
}
