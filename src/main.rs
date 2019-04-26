#![warn(
    clippy::all,
    clippy::pedantic,
    clippy::nursery,
    clippy::style,
    clippy::complexity,
    clippy::restriction,
    clippy::perf,
    clippy::cargo,
    clippy::correctness
)]
#![allow(
    clippy::module_inception,
    clippy::too_many_arguments,
    clippy::missing_docs_in_private_items,
    clippy::use_self,
    clippy::multiple_inherent_impl,
    clippy::module_name_repetitions,
    clippy::wildcard_enum_match_arm,
    clippy::implicit_return,
    clippy::pub_enum_variant_names,
    clippy::multiple_crate_versions,
    clippy::cargo_common_metadata,
)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

use actix::prelude::*;
use actix_web::middleware::Logger;
use actix_web::{http::Method, server, App, HttpResponse};
use log::info;
use dotenv::dotenv;

mod app;
mod assets;
mod auth;
mod errors;
mod models;
mod repositories;
mod rss_feeds;
mod rss_feeds_job;
mod rss_sources;
mod schema;
mod services;
mod users;

use crate::app::app_state::AppState;
use crate::app::config;
use crate::app::db::{create_diesel_pool, DbExecutor};
use crate::auth::auth::Auth;
use crate::rss_feeds::change_rss_feed_reaction::change_rss_feed_reaction;
use crate::rss_feeds::get_rss_feeds::get_rss_feeds;
use crate::rss_feeds_job::run_rss_job;
use crate::rss_sources::add_rss_source::add_rss_source;
use crate::rss_sources::follow_rss_source::follow_rss_source;
use crate::rss_sources::get_rss_source::get_rss_source;
use crate::rss_sources::get_rss_sources::get_rss_sources;
use crate::rss_sources::get_unfollowed_rss_sources::get_unfollowed_rss_sources;
use crate::rss_sources::my_rss_sources::my_rss_sources;
use crate::rss_sources::search_rss_sources::search_rss_source_handler;
use crate::users::login::login;
use crate::users::signup::signup;

fn me(auth: Auth) -> HttpResponse {
    HttpResponse::Ok().json(auth.claime.user)
}

embed_migrations!("./migrations");

pub fn run() {
    env_logger::init();

    let sys = actix::System::new("mindstream");

    let pool = create_diesel_pool(config::CONFIG.database_url.clone());

    let connection = pool.clone().get().unwrap();
    embedded_migrations::run(&*connection).expect("Embed migrations failed");

    run_rss_job(pool.clone());

    let db_addr = SyncArbiter::start(3, move || DbExecutor::new(pool.clone()));

    let host = &config::CONFIG.host;
    let port = &config::CONFIG.port;
    let address = format!("{}:{}", host, port);

    server::new(move || {
        vec![
            App::with_state(AppState::new(db_addr.clone()))
                .prefix("/api")
                .middleware(Logger::default())
                .resource("/users/signup", |r| r.method(Method::POST).with(signup))
                .resource("/users/login", |r| r.method(Method::POST).with(login))
                .resource("/users/me", |r| r.method(Method::GET).with(me))
                .resource("/rss/sources", |r| {
                    r.method(Method::GET).with(my_rss_sources);
                    r.method(Method::POST).with(add_rss_source);
                })
                .resource("/rss/sources/search", |r| r.method(Method::GET).with(search_rss_source_handler))
                .resource("/rss/sources/unfollowed", |r| r.method(Method::GET).with(get_unfollowed_rss_sources))
                .resource("/rss/sources/public", |r| r.method(Method::GET).with(get_rss_sources))
                .resource("/rss/sources/{uuid}", |r| r.method(Method::GET).with(get_rss_source))
                .resource("/rss/sources/{uuid}/follow", |r| r.method(Method::POST).with(follow_rss_source))
                .resource("/rss/feeds", |r| r.method(Method::GET).with(get_rss_feeds))
                .resource("/rss/feeds/reaction", |r| r.method(Method::PUT).with(change_rss_feed_reaction))
                .boxed(),
            assets::create_static_assets_app().boxed(),
        ]
    })
    .bind(&address)
    .unwrap_or_else(|_| panic!("Can not bind to {}", &address))
    .start();

    info!("Run server at {}", &address);

    let _ = sys.run();
}

fn main() {
    dotenv().ok();
    run();
}
