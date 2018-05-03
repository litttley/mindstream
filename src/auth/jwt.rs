use jsonwebtoken::{encode, decode, Header, Validation};

use users::user::User;
use errors::Error;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claime {
    pub user:User,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Token(String);

impl Claime {
    pub fn new(user: User) -> Self {
        Claime { user }
    }
}

pub fn create_token(user: User, secret_key: &str) -> Result<Token, Error> {
    let claims = Claime::new(user);
    let token = encode(&Header::default(), &claims, secret_key.as_bytes())?;
    Ok(Token(token))
}

pub fn decode_token(token: &str, secret_key: &str) -> Result<Claime, Error> {
    let claims = decode::<Claime>(token, secret_key.as_bytes(), &Validation::default())?;
    let claims = claims.claims;
    Ok(claims)
}