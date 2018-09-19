#![cfg_attr(
  feature = "cargo-clippy",
  allow(
    needless_pass_by_value, module_inception, too_many_arguments,
    proc_macro_derive_resolution_fallback
  )
)]
#![allow(proc_macro_derive_resolution_fallback)]

extern crate actix;
extern crate actix_web;
extern crate futures;
#[macro_use]
extern crate failure;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate serde_json;
#[macro_use]
extern crate diesel;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate uuid;
extern crate chrono;
extern crate bcrypt;
extern crate jsonwebtoken;
#[macro_use]
extern crate lazy_static;
extern crate reqwest;
extern crate feed_rs;
extern crate validator;
#[macro_use]
extern crate validator_derive;
#[macro_use]
extern crate log;
extern crate env_logger;
extern crate strum;
#[macro_use]
extern crate strum_macros;
extern crate url;
#[macro_use]
extern crate envconfig_derive;
extern crate envconfig;

use actix_web::middleware::Logger;
use actix_web::{server, App, http::Method, HttpResponse};
use actix::prelude::*;

mod app;
mod auth;
mod rss_sources;
mod rss_feeds;
mod users;
mod pagination;
mod schema;
mod errors;
mod assets;

use app::app_state::AppState;
use app::db::{DbExecutor, create_diesel_pool};
use auth::auth::Auth;
use users::signup::signup;
use users::login::login;
use rss_sources::add_rss_source::add_rss_source;
use rss_sources::follow_rss_source::follow_rss_source;
use rss_sources::get_rss_source::get_rss_source;
use rss_sources::get_rss_sources::get_rss_sources;
use rss_sources::get_unfollowed_rss_sources::get_unfollowed_rss_sources;
use rss_sources::my_rss_sources::my_rss_sources;
use rss_feeds::rss_feeds_job::run_rss_job;
use rss_feeds::get_rss_feeds::get_rss_feeds;
use rss_feeds::change_rss_feed_reaction::change_rss_feed_reaction;
use app::config;

fn me(auth: Auth) -> HttpResponse {
    HttpResponse::Ok().json(auth.claime.user)
}

pub fn run() {
    env_logger::init();

    let sys = actix::System::new("mindstream");

    let pool = create_diesel_pool();

    let _ = run_rss_job(pool.clone());

    let db_addr = SyncArbiter::start(3, move || DbExecutor::new(pool.clone()));

    let host = &config::CONFIG.host;
    let port = &config::CONFIG.port;
    let address = format!("{}:{}", host, port);

    server::new(move || vec![
        App::with_state(AppState::new(db_addr.clone()))
            .prefix("/api")
            .middleware(Logger::default())
            .resource("/users/signup", |r| r.method(Method::POST).with(signup))
            .resource("/users/login", |r| r.method(Method::POST).with(login))
            .resource("/users/me", |r| r.method(Method::GET).with(me))
            .resource("/source", |r| r.method(Method::GET).with(get_rss_sources))
            .resource("/source/unfollowed", |r| r.method(Method::GET).with(get_unfollowed_rss_sources))
            .resource("/source/my", |r| r.method(Method::GET).with(my_rss_sources))
            .resource("/source/add", |r| r.method(Method::POST).with(add_rss_source))
            .resource("/rss/feeds", |r| r.method(Method::GET).with(get_rss_feeds))
            .resource("/rss/feeds/reaction", |r| r.method(Method::PUT).with(change_rss_feed_reaction))
            .resource("/source/{uuid}/fallow", |r| r.method(Method::POST).with(follow_rss_source))
            .resource("/source/{uuid}", |r| r.method(Method::GET).with(get_rss_source))
            .boxed(),
        assets::create_static_assets_app().boxed(),
    ])
    .bind(&address)
    .expect(&format!("Can not bind to {}", &address))
    .start();

    info!("Run server at {}", &address);

    let _ = sys.run();
}
