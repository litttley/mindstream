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

use actix_web::middleware::Logger;
use actix_web::{server, App, http::Method, HttpResponse};
use actix::prelude::*;

mod app;
mod auth;
mod rss_sources;
mod users;
mod pagination;
mod schema;
mod errors;

use app::app_state::AppState;
use app::db::{DbExecutor, create_diesel_pool};
use auth::auth::Auth;
use users::signup::signup;
use users::login::login;
use rss_sources::add_rss_source::add_rss_source;
use rss_sources::follow_rss_source::follow_rss_source;
use rss_sources::get_rss_source::get_rss_source;
use rss_sources::get_rss_sources::get_rss_sources;
use rss_sources::my_rss_sources::my_rss_sources;

fn me(auth: Auth) -> HttpResponse {
    HttpResponse::Ok().json(auth.claime.user)
}

pub fn run() {
    let sys = actix::System::new("mindstream");

    let pool = create_diesel_pool();

    let db_addr = SyncArbiter::start(3, move || DbExecutor::new(pool.clone()));

    server::new(move ||
        App::with_state(AppState::new(db_addr.clone()))
            .prefix("/api")
            .middleware(Logger::default())
            .resource("/signup", |r| r.method(Method::POST).with2(signup))
            .resource("/login", |r| r.method(Method::POST).with2(login))
            .resource("/me", |r| r.method(Method::GET).with(me))
            .resource("/source", |r| r.method(Method::GET).with2(get_rss_sources))
            .resource("/source/my", |r| r.method(Method::GET).with3(my_rss_sources))
            .resource("/source/add", |r| r.method(Method::POST).with2(add_rss_source))
            .resource("/source/{uuid}/fallow", |r| r.method(Method::POST).with3(follow_rss_source))
            .resource("/source/{uuid}", |r| r.method(Method::GET).with2(get_rss_source))
    )
    .bind("127.0.0.1:9999")
    .expect("Can not bind to 127.0.0.1:9999")
    .start();

    let _ = sys.run();
}
