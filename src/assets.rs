use actix_web::fs::{NamedFile, StaticFiles};
use actix_web::middleware::Logger;
use actix_web::{http::Method, App, HttpRequest, Result};

use crate::app::config;

fn index_html(_: &HttpRequest) -> Result<NamedFile> {
    Ok(NamedFile::open(format!("{}/index.html", &config::CONFIG.assets.clone().unwrap_or("./static".to_string())))?)
}

pub fn create_static_assets_app() -> App {
    App::new()
        .middleware(Logger::default())
        .resource("/", |r| r.method(Method::GET).f(index_html))
        .handler(
            "/",
            StaticFiles::new(&config::CONFIG.assets.clone().unwrap_or("./static".to_string())).expect("static folder not found"),
        )
}
