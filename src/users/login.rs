use actix_web::web::{block, Data, HttpResponse, Json};
use futures::future::Future;
use validator::Validate;

use crate::config::Config;
use crate::db::DbPool;
use crate::errors::AppError;
use crate::jwt::create_token;
use crate::models::user::verify_password;
use crate::models::{AuthResponse, Login};
use crate::repositories::users;

fn login(pool: &DbPool, config: &Config, payload: &Login) -> Result<AuthResponse, AppError> {
    payload.validate()?;
    let connection = pool.get()?;
    let user = users::find_by_email(&connection, &payload.email)?;
    if let Ok(true) = verify_password(&payload.password, &user.password) {
        let token = create_token(user.clone(), &config.secret_key)?;
        Ok(AuthResponse::new(user, token))
    } else {
        Err(AppError::Unauthorized)
    }
}

pub fn login_service(
    payload: Json<Login>,
    config: Data<Config>,
    pool: Data<DbPool>,
) -> impl Future<Item = HttpResponse, Error = AppError> {
    block(move || login(&pool, &config, &payload))
        .and_then(|auth_response| Ok(HttpResponse::Ok().json(auth_response)))
        .from_err()
}
