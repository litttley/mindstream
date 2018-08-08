use std::path::PathBuf;
use actix_web::middleware::Logger;
use actix_web::{App, HttpRequest, HttpResponse, Result, http::Method, fs};

fn index_html(_: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().body(include_str!("../static/index.html"))
}

fn main_js(_: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().body(include_str!("../static/main.js"))
}

fn main_css(_: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().body(include_str!("../static/main.css"))
}

fn main_map(_: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().body(include_str!("../static/main.map"))
}

pub fn create_compiled_assets_app() -> App {
    App::new()
            .prefix("/assets")
            .middleware(Logger::default())
            .resource("/main.js", |r| r.method(Method::GET).f(main_js))
            .resource("/main.css", |r| r.method(Method::GET).f(main_css))
            .resource("/main.map", |r| r.method(Method::GET).f(main_map))
}

pub fn create_compiled_index_assets_app() -> App {
    App::new()
            .middleware(Logger::default())
            .resource("/", |r| r.method(Method::GET).f(index_html))
}
