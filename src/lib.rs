extern crate actix;
extern crate actix_web;
extern crate futures;

extern crate serde;
// #[macro_use]
// extern crate serde_derive;

use actix_web::middleware::Logger;
use actix_web::{server, App, HttpRequest};

pub struct AppState {}

fn index(_req: HttpRequest<AppState>) -> &'static str {
    "Hello world!"
}

pub fn run() {
    let _sys = actix::System::new("mindstream");

    server::new(move || {
        App::with_state(AppState {})
            .middleware(Logger::default())
            .resource("/", |r| r.f(index))
    })
    .bind("127.0.0.1:9999")
    .expect("Can not bind to 127.0.0.1:9999")
    .run();
}
