use diesel;
use actix_web::{HttpResponse, ResponseError, http};
use actix;
use r2d2;
use bcrypt;
use jsonwebtoken;
use reqwest;
use validator;

#[derive(Debug, Serialize)]
pub struct ApiError {
    message: String,
    errors: Option<validator::ValidationErrors>
}

impl ApiError {
    pub fn new(message: &str) -> Self {
        Self { message: message.to_owned(), errors: None }
    }

    pub fn with_errors(message: &str, errors: validator::ValidationErrors) -> Self {
        Self { message: message.to_owned(), errors: Some(errors) }
    }
}

#[derive(Fail, Debug)]
pub enum Error {
   #[fail(display="internal error")]
   InternalError,
   #[fail(display="bad request")]
   BadRequest(ApiError),
   #[fail(display="not found")]
   NotFound,
   #[fail(display="timeout")]
   Timeout,
   #[fail(display="unauthorized")]
   Unauthorized,
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
       match *self {
          Error::InternalError => HttpResponse::new(http::StatusCode::INTERNAL_SERVER_ERROR),
          Error::BadRequest(ref api_error) => HttpResponse::build(http::StatusCode::BAD_REQUEST).json(api_error),
          Error::NotFound => HttpResponse::new(http::StatusCode::NOT_FOUND),
          Error::Timeout => HttpResponse::new(http::StatusCode::GATEWAY_TIMEOUT),
          Error::Unauthorized => HttpResponse::new(http::StatusCode::UNAUTHORIZED),
       }
    }
}

impl From<diesel::result::Error> for Error {
    fn from(error: diesel::result::Error) -> Error {
        error!("ERROR diesel = {:?}", error);
        match error {
            diesel::result::Error::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _) => {
                Error::BadRequest(ApiError::new("already.exist"))
            },
            _ => Error::InternalError
        }
    }
}


impl From<actix::MailboxError> for Error {
    fn from(error: actix::MailboxError) -> Error {
        error!("ERROR actix mailbox = {:?}", error);
        Error::InternalError
    }
}

impl From<r2d2::Error> for Error {
    fn from(error: r2d2::Error) -> Error {
        error!("ERROR r2d2 = {:?}", error);
        Error::InternalError
    }
}

impl From<bcrypt::BcryptError> for Error {
    fn from(error: bcrypt::BcryptError) -> Error {
        error!("ERROR bcrypt = {:?}", error);
        Error::InternalError
    }
}

impl From<jsonwebtoken::errors::Error> for Error {
    fn from(error: jsonwebtoken::errors::Error) -> Error {
        error!("ERROR jsonwebtoken = {:?}", error);
        Error::Unauthorized
    }
}

impl From<reqwest::Error> for Error {
    fn from(error: reqwest::Error) -> Error {
        error!("ERROR reqwest = {:?}", error);
        Error::InternalError
    }
}

impl From<validator::ValidationErrors> for Error {
    fn from(error: validator::ValidationErrors) -> Error {
        error!("ERROR validator = {:?}", error);
        Error::BadRequest(error.into())
    }
}

impl From<validator::ValidationErrors> for ApiError {
    fn from(errors: validator::ValidationErrors) -> ApiError {
        error!("ERROR validator = {:?}", errors);
        ApiError::with_errors("validation.error", errors)
    }
}
