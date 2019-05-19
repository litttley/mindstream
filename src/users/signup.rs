use std::convert::TryFrom;

use actix_web::web::{block, Data, HttpResponse, Json};
use futures::future::Future;
use validator::Validate;

use crate::config::Config;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::jwt::create_token;
use crate::models::{AuthResponse, Signup, User};
use crate::repositories::users::insert;

fn signup(pool: &DbPool, config: &Config, payload: Signup) -> Result<AuthResponse, AppError> {
    payload.validate()?;
    let connection = pool.get()?;
    let user = User::try_from(payload)?;
    let user = insert(&connection, &user)?;
    let token = create_token(user.clone(), &config.secret_key)?;
    Ok(AuthResponse::new(user, token))
}

pub fn signup_service(
    payload: Json<Signup>,
    config: Data<Config>,
    pool: Data<DbPool>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || signup(&pool, &config, payload.into_inner()))
        .and_then(|auth_response| Ok(HttpResponse::Ok().json(auth_response)))
        .from_err()
}
