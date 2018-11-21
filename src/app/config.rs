use envconfig::Envconfig;
use envconfig_derive::Envconfig;
use lazy_static::lazy_static;
use log::error;

#[derive(Debug, Clone, Envconfig)]
pub struct Config {
    #[envconfig(from = "SECRET_KEY")]
    pub secret_key: String,

    #[envconfig(from = "DATABASE_URL")]
    pub database_url: String,

    #[envconfig(from = "MERCURY_API_KEY")]
    pub mercury_api_key: String,

    #[envconfig(from = "RSS_JOB_INTERVAL")]
    pub rss_job_interval: u64,

    #[envconfig(from = "DEFAULT_LIMIT")]
    pub default_limit: i64,

    #[envconfig(from = "HOST")]
    pub host: String,

    #[envconfig(from = "PORT")]
    pub port: usize,
}

lazy_static! {
    pub static ref CONFIG: Config = {
        Config::init().unwrap_or_else(|err| {
            error!("{}", err);
            ::std::process::exit(1);
        })
    };
}
