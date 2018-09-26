use actix::{Actor, SyncContext};
use diesel::PgConnection;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;

pub struct DbExecutor {
    pub pool: Pool<ConnectionManager<PgConnection>>,
}
impl DbExecutor {
    pub fn new(pool: Pool<ConnectionManager<PgConnection>>) -> Self {
        DbExecutor { pool }
    }
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
