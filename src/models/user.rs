use uuid::Uuid;
use chrono::prelude::*;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Insertable};
use bcrypt::{hash, verify, BcryptError, DEFAULT_COST};

use crate::errors::Error;
use crate::schema::users;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name = "users"]
pub struct User {
    pub uuid: Uuid,
    pub login: String,
    pub email: String,
    #[serde(skip_serializing, skip_deserializing)]
    pub password: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
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
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }

    pub fn new_secure(
        login: impl Into<String>,
        email: impl Into<String>,
        password: impl Into<String>,
    ) -> Result<Self, Error> {
        let hashed_password = hash_password(&password.into())?;
        let user = Self::new(login, email, hashed_password);
        Ok(user)
    }
}

pub fn hash_password(password: &str) -> Result<String, BcryptError> {
    Ok(hash(password, DEFAULT_COST)?)
}

pub fn verify_password(password: &str, hashed_password: &str) -> Result<bool, BcryptError> {
    Ok(verify(password, hashed_password)?)
}
