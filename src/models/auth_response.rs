use derive_new::new;
use serde::Serialize;

use crate::jwt::Token;
use crate::models::User;

#[derive(Debug, Serialize, new)]
pub struct AuthResponse {
    user: User,
    token: Token,
}
