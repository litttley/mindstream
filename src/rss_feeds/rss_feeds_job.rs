use std::thread;
use reqwest::Client;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;
use diesel::PgConnection;

use errors::Error;
use app::config;
use users::user::User;
use rss_sources::rss_source::RssSource;
use rss_sources::rss_service::fetch_feeds_channel;
use rss_sources::rss_sources_repository::find_rss_sources;
use rss_sources::users_rss_sources_repository::find_rss_source_subscribers;
use rss_feeds::rss_feed::RssFeed;
use rss_feeds::rss_feeds_repository::{is_rss_feed_exists, insert_rss_feed};
use rss_feeds::user_rss_feed::UserRssFeed;
use rss_feeds::users_rss_feeds_repository::{is_user_feed_already_inserted, insert_user_rss_feed};
use rss_feeds::mercury::fetch_readable;

pub fn run_rss_job(pool: Pool<ConnectionManager<PgConnection>>) {
    let client = Client::new();
    let rss_job_interval = config::CONFIG.rss_job_interval;
    thread::spawn(move || {
        loop {
            if let Err(err) = process_feeds(&client, &pool) {
                error!("process_rss error {:?}", err);
            }
            thread::sleep(rss_job_interval);
        }
    });
}

fn process_feeds(client: &Client, pool: &Pool<ConnectionManager<PgConnection>>) -> Result<(), Error> {
    let connexion = pool.get()?;
    let rss_sources = find_rss_sources(&connexion, i64::max_value(), 0)?;
    for rss_source in rss_sources {
        let subscribers = find_rss_source_subscribers(&connexion, &rss_source)?;
        let _ = process_rss_source(&connexion, &subscribers, &rss_source, client)?;
    }
    Ok(())
}

fn process_rss_source(connection: &PgConnection, subscribers: &Vec<User>, rss_source: &RssSource, client: &Client) -> Result<(), Error> {
    if let Ok(Some(feeds_channel)) = fetch_feeds_channel(&rss_source.url) {
        for rss in &feeds_channel.entries {
            for link in &rss.alternate {
                match client.get(&link.href).send() {
                    Ok(ref response) if response.status().is_success() => {
                        let mut url = response.url().clone();
                        url.set_query(None);
                        let url = url.as_str();
                        if !is_rss_feed_exists(&connection, url)? {
                            let readable = fetch_readable(client, url).ok().and_then(|readable| readable);
                            let rss_feed = RssFeed::new(url, Some(rss.clone().into()), readable, rss_source);
                            if insert_rss_feed(&connection, &rss_feed).is_ok() {
                                insert_subscribers_feeds(&connection, subscribers, &rss_feed)?;
                            }
                        }
                    },
                    Ok(ref response) => error!("resolve url status error {:?} -> {:?}", link.href, response.status()),
                    Err(e) => error!("resolve url error {:?} -> {:?}", link.href, e)
                }
            }
        }
    }
    Ok(())
}

fn insert_subscribers_feeds(connection: &PgConnection, subscribers: &Vec<User>, rss_feed: &RssFeed) -> Result<(), Error> {
    for subscriber in subscribers {
        let user_feed = UserRssFeed::new(subscriber.uuid, rss_feed.uuid.clone(), "Unreaded".to_owned());
        if !is_user_feed_already_inserted(&connection, &rss_feed.url, &subscriber)? {
            if insert_user_rss_feed(&connection, &user_feed).is_ok() {
                info!("insert subscriber {:?} -> {:?}", subscriber.login, &rss_feed.url);
            }
        }
    }
    Ok(())
}
