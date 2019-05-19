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
    clippy::module_name_repetitions,
    clippy::wildcard_enum_match_arm,
    clippy::implicit_return,
    clippy::multiple_crate_versions,
    clippy::missing_docs_in_private_items,
    clippy::too_many_arguments
)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

mod auth;
mod config;
mod db;
mod errors;
mod jwt;
mod models;
mod repositories;
mod rss_feeds;
mod rss_feeds_job;
mod rss_sources;
mod schema;
mod upload;
mod services;
mod users;

use actix_files::Files;
use actix_web::{middleware, web, App, HttpServer};
use dotenv::dotenv;
use log::info;

use crate::config::Config;
use crate::db::create_diesel_pool;
use crate::rss_feeds::{change_rss_feed_reaction_service, get_rss_feeds_service};
use crate::rss_feeds_job::run_rss_job;
use crate::rss_sources::{
    add_rss_source_service, follow_rss_source_service, get_rss_source_service,
    my_rss_sources_service, public_rss_source_service, search_rss_source_service,
    unfollow_rss_source_service, unfollowed_rss_sources_service,
};
use crate::users::{login_service, me_service, signup_service};

embed_migrations!("./migrations");

fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();
    let config = Config::new().expect("Invalid Config");
    let address = config.address();
    let assets = config.assets();
    info!("Server at {} and assets = {}", &address, &assets);

    let pool = create_diesel_pool(config.database_url.clone());
    let connection = pool.clone().get().unwrap();
    embedded_migrations::run(&*connection).expect("Embed migrations failed");

    run_rss_job(pool.clone(), config.clone());

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .data(config.clone())
            .wrap(middleware::DefaultHeaders::new().header("X-Version", "0.1.0"))
            .wrap(middleware::Compress::default())
            .wrap(middleware::Logger::default())
            .service(web::resource("/api/users/login").route(web::post().to_async(login_service)))
            .service(web::resource("/api/users/signup").route(web::post().to_async(signup_service)))
            .service(web::resource("/api/users/me").route(web::get().to(me_service)))
            .service(
                web::resource("/api/rss/sources")
                    .route(web::get().to_async(my_rss_sources_service))
                    .route(web::post().to_async(add_rss_source_service)),
            )
            .service(
                web::resource("/api/rss/sources/search")
                    .route(web::get().to_async(search_rss_source_service)),
            )
            .service(
                web::resource("/api/rss/sources/unfollowed")
                    .route(web::get().to_async(unfollowed_rss_sources_service)),
            )
            .service(
                web::resource("/api/rss/sources/public")
                    .route(web::get().to_async(public_rss_source_service)),
            )
            .service(
                web::resource("/api/rss/sources/{uuid}")
                    .route(web::get().to_async(get_rss_source_service))
                    .route(web::delete().to_async(unfollow_rss_source_service)),
            )
            .service(
                web::resource("/api/rss/sources/{uuid}/follow")
                    .route(web::post().to_async(follow_rss_source_service)),
            )
            .service(
                web::resource("/api/rss/feeds").route(web::get().to_async(get_rss_feeds_service)),
            )
            .service(
                web::resource("/api/rss/feeds/reaction")
                    .route(web::put().to_async(change_rss_feed_reaction_service)),
            )
            .service(Files::new("/", &assets).index_file("index.html"))
    })
    .bind(&address)?
    .run()
}
