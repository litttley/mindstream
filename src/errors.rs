use actix;
use actix_web::error::JsonPayloadError;
use actix_web::{http, HttpResponse, ResponseError};
use bcrypt;
use diesel;
use failure::Fail;
use jsonwebtoken;
use log::error;
use r2d2;
use reqwest;
use serde::Serialize;
use validator;

#[derive(Debug, Serialize)]
pub struct ApiError {
    message: String,
    errors: Option<validator::ValidationErrors>,
}

impl ApiError {
    pub fn new(message: &str) -> Self {
        Self {
            message: message.to_owned(),
            errors: None,
        }
    }

    pub fn with_errors(message: &str, errors: validator::ValidationErrors) -> Self {
        Self {
            message: message.to_owned(),
            errors: Some(errors),
        }
    }
}

#[derive(Fail, Debug)]
pub enum Error {
    #[fail(display = "internal error")]
    Internal,
    #[fail(display = "bad request")]
    BadRequest(ApiError),
    #[fail(display = "not found")]
    NotFound,
    #[fail(display = "timeout")]
    Timeout,
    #[fail(display = "unauthorized")]
    Unauthorized,
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        match *self {
            Error::Internal => HttpResponse::new(http::StatusCode::INTERNAL_SERVER_ERROR),
            Error::BadRequest(ref api_error) => {
                HttpResponse::build(http::StatusCode::BAD_REQUEST).json(api_error)
            }
            Error::NotFound => HttpResponse::new(http::StatusCode::NOT_FOUND),
            Error::Timeout => HttpResponse::new(http::StatusCode::GATEWAY_TIMEOUT),
            Error::Unauthorized => HttpResponse::new(http::StatusCode::UNAUTHORIZED),
        }
    }
}

impl From<diesel::result::Error> for Error {
    fn from(error: diesel::result::Error) -> Self {
        error!("ERROR diesel = {:?}", error);
        match error {
            diesel::result::Error::DatabaseError(
                diesel::result::DatabaseErrorKind::UniqueViolation,
                _,
            ) => Error::BadRequest(ApiError::new("already.exist")),
            diesel::result::Error::NotFound => Error::NotFound,
            _ => Error::Internal,
        }
    }
}

impl From<actix::MailboxError> for Error {
    fn from(error: actix::MailboxError) -> Self {
        error!("ERROR actix mailbox = {:?}", error);
        Error::Internal
    }
}

impl From<JsonPayloadError> for Error {
    fn from(error: JsonPayloadError) -> Self {
        error!("ERROR actix JsonPayloadError = {:?}", error);
        match error {
            JsonPayloadError::Deserialize(json_error) => {
                Error::BadRequest(ApiError::new(&format!("{}", json_error)))
            }
            _ => Error::BadRequest(ApiError::new("Json parsing error")),
        }
    }
}

impl From<r2d2::Error> for Error {
    fn from(error: r2d2::Error) -> Self {
        error!("ERROR r2d2 = {:?}", error);
        Error::Internal
    }
}

impl From<bcrypt::BcryptError> for Error {
    fn from(error: bcrypt::BcryptError) -> Self {
        error!("ERROR bcrypt = {:?}", error);
        Error::Internal
    }
}

impl From<jsonwebtoken::errors::Error> for Error {
    fn from(error: jsonwebtoken::errors::Error) -> Self {
        error!("ERROR jsonwebtoken = {:?}", error);
        Error::Unauthorized
    }
}

impl From<reqwest::Error> for Error {
    fn from(error: reqwest::Error) -> Self {
        error!("ERROR reqwest = {:?}", error);
        Error::Internal
    }
}

impl From<validator::ValidationErrors> for Error {
    fn from(error: validator::ValidationErrors) -> Self {
        error!("ERROR validator = {:?}", error);
        Error::BadRequest(error.into())
    }
}

impl From<validator::ValidationErrors> for ApiError {
    fn from(errors: validator::ValidationErrors) -> Self {
        error!("ERROR validator = {:?}", errors);
        Self::with_errors("validation.error", errors)
    }
}
