use serde::Deserialize;
use validator::Validate;
use validator_derive::Validate;

#[derive(Debug, Clone, Validate, Deserialize)]
pub struct Login {
    #[validate(email(message = "validation.email"))]
    pub email: String,
    #[validate(length(min = "6", message = "validation.password.short"))]
    pub password: String,
}
