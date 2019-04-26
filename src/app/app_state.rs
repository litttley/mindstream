use actix::Addr;
use derive_new::new;

use crate::app::db::DbExecutor;

#[derive(new)]
pub struct AppState {
    pub db: Addr<DbExecutor>,
}
