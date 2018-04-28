use actix_web::{State, Json, HttpResponse, AsyncResponder};
use futures::future::Future;
use actix::prelude::*;

use user::User;
use users;
use db::DbExecutor;
use app_state::AppState;
use errors;

// TODO add validation
#[derive(Debug, Deserialize, Serialize)]
pub struct Signup {
    login: String,
    email: String,
    password: String
}

impl Message for Signup {
    type Result = Result<User, errors::Error>;
}

impl Handler<Signup> for DbExecutor {
    type Result = Result<User, errors::Error>;

    fn handle(&mut self, message: Signup, _: &mut Self::Context) -> Self::Result {
        let connexion = self.pool.get()?;
        let user = User::from_signup(&message)?;
        let user = users::insert(&connexion, &user)?;
        Ok(user)
    }
}

impl User {
    pub fn from_signup(signup: &Signup) -> Result<Self, errors::Error> {
        Ok(User::new_secure(&signup.login, &signup.email, &signup.password)?)
    }
}

pub fn signup(signup: Json<Signup>, state: State<AppState>) -> Box<Future<Item=HttpResponse, Error=errors::Error>> {
    state.db
        .send(signup.0)
        .from_err()
        .and_then(|res| {
            match res {
                Ok(user) => Ok(HttpResponse::Ok().json(user)),
                Err(err) => Err(err.into())
            }
        })
        .responder()
}
