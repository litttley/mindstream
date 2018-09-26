use actix_web::Error;
use actix_web::{FromRequest, HttpMessage, HttpRequest};

use app::config;
use auth::jwt::{decode_token, Claime};
use errors;

#[derive(Debug)]
pub struct Auth {
    pub claime: Claime,
}

impl Auth {
    fn new(claime: Claime) -> Self {
        Auth { claime }
    }
}

impl<S> FromRequest<S> for Auth
where
    S: 'static,
{
    type Config = ();
    type Result = Result<Self, Error>;

    fn from_request(req: &HttpRequest<S>, _: &Self::Config) -> Self::Result {
        req.headers()
            .get("Authorization")
            .ok_or_else(|| errors::Error::Unauthorized)
            .and_then(|token| token.to_str().map_err(|_| errors::Error::Unauthorized))
            .and_then(|token| decode_token(token, &config::CONFIG.secret_key))
            .map(Auth::new)
            .map_err(|e| e.into())
    }
}
