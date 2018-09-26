use actix_web::fs::{NamedFile, StaticFiles};
use actix_web::middleware::Logger;
use actix_web::{http::Method, App, HttpRequest, Result};

fn index_html(_: &HttpRequest) -> Result<NamedFile> {
    Ok(NamedFile::open("./static/index.html")?)
}

pub fn create_static_assets_app() -> App {
    App::new()
        .middleware(Logger::default())
        .resource("/", |r| r.method(Method::GET).f(index_html))
        .handler("/", StaticFiles::new("./static/").unwrap())
}
