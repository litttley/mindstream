use actix::Addr;

use crate::app::db::DbExecutor;

pub struct AppState {
    pub db: Addr<DbExecutor>,
}

impl AppState {
    pub const fn new(db: Addr<DbExecutor>) -> Self {
        AppState { db }
    }
}
