use uuid::Uuid;
use chrono::prelude::*;
use chrono::NaiveDateTime;
use bcrypt::{DEFAULT_COST, hash, verify, BcryptError};

use schema::users;
use errors::Error;

#[derive(Debug, Clone, PartialEq, Deserialize, Serialize, Queryable, Insertable)]
#[table_name="users"]
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
    fn new(login: &str, email: &str, password: &str) -> Self {
        User {
            uuid: Uuid::new_v4(),
            login: login.to_owned(),
            email: email.to_owned(),
            password: password.to_owned(),
            created: Utc::now().naive_utc(),
            updated: Utc::now().naive_utc()
        }
    }

    pub fn new_secure(login: &str, email: &str, password: &str) -> Result<Self, Error> {
        let hashed_password = hash_password(&password)?;
        let user = User::new(login, email, &hashed_password);
        Ok(user)
    }
}

pub fn hash_password(password: &str) -> Result<String, BcryptError> {
    Ok(hash(password, DEFAULT_COST)?)
}

pub fn verify_password(password: &str, hashed_password: &str) -> Result<bool, BcryptError> {
    Ok(verify(password, hashed_password)?)
}
