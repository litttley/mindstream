use std::convert::TryFrom;

use bcrypt::{hash, verify, BcryptError, DEFAULT_COST};
use chrono::{NaiveDateTime, Utc};
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::AppError;
use crate::models::Signup;
use crate::schema::users;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users"]
pub struct User {
    pub uuid: Uuid,
    pub login: String,
    pub email: String,
    #[serde(skip_serializing, skip_deserializing)]
    pub password: String,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
}

impl User {
    fn new(
        login: impl Into<String>,
        email: impl Into<String>,
        password: impl Into<String>,
    ) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            login: login.into(),
            email: email.into(),
            password: password.into(),
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc(),
        }
    }

    pub fn new_secure(
        login: impl Into<String>,
        email: impl Into<String>,
        password: impl Into<String>,
    ) -> Result<Self, AppError> {
        let hashed_password = hash_password(&password.into())?;
        let user = Self::new(login, email, hashed_password);
        Ok(user)
    }
}

impl TryFrom<Signup> for User {
    type Error = AppError;

    fn try_from(signup: Signup) -> Result<Self, Self::Error> {
        Ok(Self::new_secure(
            signup.login,
            signup.email,
            signup.password,
        )?)
    }
}

pub fn hash_password(password: &str) -> Result<String, BcryptError> {
    Ok(hash(password, DEFAULT_COST)?)
}

pub fn verify_password(password: &str, hashed_password: &str) -> Result<bool, BcryptError> {
    Ok(verify(password, hashed_password)?)
}
