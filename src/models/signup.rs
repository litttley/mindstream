use serde::Deserialize;
use validator::Validate;
use validator_derive::Validate;

#[derive(Debug, Clone, Validate, Deserialize)]
pub struct Signup {
    #[validate(length(min = "3", message = "validation.login.short"))]
    pub login: String,
    #[validate(email(message = "validation.email"))]
    pub email: String,
    #[validate(length(min = "6", message = "validation.password.short"))]
    pub password: String,
}
