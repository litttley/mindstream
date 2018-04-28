use actix::prelude::*;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;
use diesel::PgConnection;

use config;

pub fn create_diesel_pool() -> Pool<ConnectionManager<PgConnection>> {
    let manager = ConnectionManager::<PgConnection>::new(config::CONFIG.database_url.clone());
    Pool::builder().build(manager).expect("Failed to create pool")
}

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
