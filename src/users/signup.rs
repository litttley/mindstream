use ::actix::prelude::*;
use actix_web::{AsyncResponder, HttpMessage, HttpRequest, HttpResponse, State};
use futures::future::Future;
use serde::Deserialize;
use serde_json::json;
use validator::Validate;
use validator_derive::Validate;

use crate::app::app_state::AppState;
use crate::app::config;
use crate::app::db::DbExecutor;
use crate::auth::jwt::{create_token, Token};
use crate::errors::Error;
use crate::models::user::User;
use crate::users::users::insert;

#[derive(Debug, Clone, Validate, Deserialize)]
pub struct Signup {
    #[validate(length(min = "3", message = "validation.login.short"))]
    login: String,
    #[validate(email(message = "validation.email"))]
    email: String,
    #[validate(length(min = "6", message = "validation.password.short"))]
    password: String,
}

impl Message for Signup {
    type Result = Result<(User, Token), Error>;
}

impl Handler<Signup> for DbExecutor {
    type Result = Result<(User, Token), Error>;

    fn handle(&mut self, message: Signup, _: &mut Self::Context) -> Self::Result {
        message.validate()?;
        let connexion = self.pool.get()?;
        let user = User::from_signup(&message)?;
        let user = insert(&connexion, &user)?;
        let config = &config::CONFIG;
        let token = create_token(user.clone(), &config.secret_key)?;
        Ok((user, token))
    }
}

impl User {
    pub fn from_signup(signup: &Signup) -> Result<Self, Error> {
        Ok(User::new_secure(
            signup.login.clone(),
            signup.email.clone(),
            signup.password.clone(),
        )?)
    }
}

pub fn signup(
    (req, state): (HttpRequest<AppState>, State<AppState>),
) -> Box<Future<Item = HttpResponse, Error = Error>> {
    req.json()
        .from_err()
        .and_then(move |signup: Signup| state.db.send(signup.clone()).from_err())
        .and_then(|res| match res {
            Ok((user, token)) => Ok(HttpResponse::Ok().json(json!({
                "user": user,
                "token": token,
            }))),
            Err(err) => Err(err),
        })
        .responder()
}
