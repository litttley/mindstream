use actix::prelude::*;

use db::DbExecutor;

pub struct AppState {
    pub db: Addr<Syn, DbExecutor>,
}

impl AppState {
    pub fn new(db: Addr<Syn, DbExecutor>) -> Self {
        AppState { db }
    }
}
