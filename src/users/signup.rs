use actix_web::{State, HttpMessage, HttpRequest, HttpResponse, AsyncResponder};
use futures::future::Future;
use actix::prelude::*;
use validator::Validate;

use errors::Error;
use app::app_state::AppState;
use app::config;
use app::db::DbExecutor;
use auth::jwt::{Token, create_token};
use users::user::User;
use users::users::insert;

#[derive(Debug, Clone, Validate, Deserialize)]
pub struct Signup {
    #[validate(length(min = "3", message="validation.login.short"))]
    login: String,
    #[validate(email(message="validation.email"))]
    email: String,
    #[validate(length(min = "6", message="validation.password.short"))]
    password: String
}

impl Message for Signup {
    type Result = Result<(User, Token), Error>;
}

impl Handler<Signup> for DbExecutor {
    type Result = Result<(User, Token), Error>;

    fn handle(&mut self, message: Signup, _: &mut Self::Context) -> Self::Result {
        let _ = message.validate()?;
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
        Ok(User::new_secure(&signup.login, &signup.email, &signup.password)?)
    }
}

pub fn signup((req, state): (HttpRequest<AppState>, State<AppState>)) -> Box<Future<Item=HttpResponse, Error=Error>> {
    req.json()
        .from_err()
        .and_then(move |signup: Signup| state.db.send(signup.clone()).from_err())
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
