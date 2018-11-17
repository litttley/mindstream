use actix::prelude::*;
use actix_web::{AsyncResponder, HttpMessage, HttpRequest, HttpResponse, State};
use futures::future::Future;
use serde_json::json;
use validator::Validate;

use app::app_state::AppState;
use app::config;
use app::db::DbExecutor;
use auth::jwt::{create_token, Token};
use errors::Error;
use users::user::{verify_password, User};
use users::users;

#[derive(Debug, Clone, Validate, Deserialize)]
pub struct Login {
    #[validate(email(message = "validation.email"))]
    email: String,
    #[validate(length(min = "6", message = "validation.password.short"))]
    password: String,
}

impl Message for Login {
    type Result = Result<(User, Token), Error>;
}

impl Handler<Login> for DbExecutor {
    type Result = Result<(User, Token), Error>;

    fn handle(&mut self, message: Login, _: &mut Self::Context) -> Self::Result {
        message.validate()?;
        let connexion = self.pool.get()?;
        let user = users::find_by_email(&connexion, &message.email)?;
        if let Ok(true) = verify_password(&message.password, &user.password) {
            let config = &config::CONFIG;
            let token = create_token(user.clone(), &config.secret_key)?;
            Ok((user, token))
        } else {
            Err(Error::Unauthorized)
        }
    }
}

pub fn login(
    (req, state): (HttpRequest<AppState>, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    req.json()
        .from_err()
        .and_then(move |login: Login| state.db.send(login.clone()).from_err())
        .and_then(|res| match res {
            Ok((user, token)) => Ok(HttpResponse::Ok().json(json!({
                    "user": user,
                    "token": token,
                }))),
            Err(err) => Err(err),
        }).responder()
}
