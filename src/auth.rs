use actix_web::Error;
use actix_web::{FromRequest, HttpMessage, HttpRequest};
use derive_new::new;

use crate::app::config;
use crate::jwt::{decode_token, Claime};
use crate::errors;

#[derive(Debug, new)]
pub struct Auth {
    pub claime: Claime,
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
            .map(Self::new)
            .map_err(Into::into)
    }
}
