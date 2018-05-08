use actix_web::{State, HttpMessage, HttpRequest, HttpResponse, AsyncResponder};
use futures::future::Future;
use actix::prelude::*;
use validator::Validate;

use errors::Error;
use app::config;
use app::db::DbExecutor;
use app::app_state::AppState;
use auth::jwt::{Token, create_token};
use users::user::{User, verify_password};
use users::users;

#[derive(Debug, Clone, Validate, Deserialize)]
pub struct Login {
    #[validate(email(message="validation.email"))]
    email: String,
    #[validate(length(min = "6", message="validation.password.short"))]
    password: String
}

impl Message for Login {
    type Result = Result<(User, Token), Error>;
}

impl Handler<Login> for DbExecutor {
    type Result = Result<(User, Token), Error>;

    fn handle(&mut self, message: Login, _: &mut Self::Context) -> Self::Result {
        let _ = message.validate()?;
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

pub fn login(req: HttpRequest<AppState>, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=Error>> {
    req.json()
        .from_err()
        .and_then(move |login: Login| state.db.send(login.clone()).from_err())
        .and_then(|res| {
            match res {
                Ok((user, token)) => Ok(HttpResponse::Ok().json(json!({
                    "user": user,
                    "token": token,
                }))),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}
