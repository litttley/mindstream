use actix_web::{FromRequest, HttpRequest, HttpMessage};
use actix_web::Error;
use futures::future::{result, FutureResult};

use auth::jwt::{Claime, decode_token};
use app::config;
use errors;

#[derive(Debug)]
pub struct Auth {
    pub claime: Claime
}

impl Auth {
    fn new(claime: Claime) -> Self {
        Auth { claime }
    }
}

impl<S> FromRequest<S> for Auth where S: 'static {
    type Config = ();
    type Result = FutureResult<Self, Error>;

    fn from_request(req: &HttpRequest<S>, _: &Self::Config) -> Self::Result {
        result(
            req.headers()
                .get("Authorization")
                .ok_or_else(|| errors::Error::Unauthorized)
                .and_then(|token| token.to_str().map_err(|_| errors::Error::Unauthorized))
                .and_then(|token| decode_token(token, &config::CONFIG.secret_key))
                .map(Auth::new)
                .map_err(|e| e.into())
        )
    }
}
