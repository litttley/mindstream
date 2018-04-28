use actix_web::{State, Json, HttpResponse, AsyncResponder};
use futures::future::Future;
use actix::prelude::*;

use errors::Error;
use user::{User, verify_password};
use users;
use db::DbExecutor;
use app_state::AppState;
use errors;
use jwt;
use config;

// TODO add validation
#[derive(Debug, Deserialize, Serialize)]
pub struct Login {
    email: String,
    password: String
}

impl Message for Login {
    type Result = Result<(User, jwt::Token), errors::Error>;
}

impl Handler<Login> for DbExecutor {
    type Result = Result<(User, jwt::Token), errors::Error>;

    fn handle(&mut self, message: Login, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let config = &config::CONFIG;
        let user = users::find_by_email(&connexion, &message.email)?;
        if let Ok(true) = verify_password(&message.password, &user.password) {
            let token = jwt::create_token(user.clone(), &config.secret_key)?;
            Ok((user, token))
        } else {
            Err(Error::Unauthorized)
        }
    }
}

pub fn login(login: Json<Login>, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=errors::Error>> {
    state.db
        .send(login.0)
        .from_err()
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

