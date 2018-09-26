use actix::Addr;

use app::db::DbExecutor;

pub struct AppState {
    pub db: Addr<DbExecutor>,
}

impl AppState {
    pub fn new(db: Addr<DbExecutor>) -> Self {
        AppState { db }
    }
}
