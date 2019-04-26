use actix::{Actor, SyncContext};
use diesel::PgConnection;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;
use derive_new::new;

#[derive(new)]
pub struct DbExecutor {
    pub pool: Pool<ConnectionManager<PgConnection>>,
}

impl Actor for DbExecutor {
    type Context = SyncContext<Self>;
}

pub fn create_diesel_pool(
    database_url: impl Into<String>,
) -> Pool<ConnectionManager<PgConnection>> {
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::builder()
        .build(manager)
        .expect("Failed to create pool")
}
