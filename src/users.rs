use diesel;
use diesel::prelude::*;
use diesel::PgConnection;
use diesel::result::Error;

use schema::users;
use schema::users::dsl::*;
use user::User;

pub fn insert(connection: &PgConnection, user: &User) -> Result<User, Error> {
    Ok(diesel::insert_into(users::table).values(user).get_result(connection)?)
}

pub fn find_by_email(connection: &PgConnection, searched_email: &str) -> Result<User, Error> {
    Ok(users.filter(email.eq(searched_email)).first::<User>(&*connection)?)
}
