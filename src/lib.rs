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

use actix_web::middleware::Logger;
use actix_web::{server, App, http, HttpResponse};
use actix::prelude::*;

mod user;
mod users;
mod db;
mod config;
mod signup;
mod login;
mod app_state;
mod schema;
mod errors;
mod jwt;
mod auth;

use app_state::AppState;
use signup::signup;
use login::login;
use db::{DbExecutor, create_diesel_pool};
use auth::Auth;

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
            .resource("/signup", |r| r.method(http::Method::POST).with2(signup))
            .resource("/login", |r| r.method(http::Method::POST).with2(login))
            .resource("/me", |r| r.method(http::Method::GET).with(me))
    )
    .bind("127.0.0.1:9999")
    .expect("Can not bind to 127.0.0.1:9999")
    .start();

    let _ = sys.run();
}
