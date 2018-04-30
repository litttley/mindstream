use std::env;
use std::time::Duration;

#[derive(Debug, Clone)]
pub struct Config {
    pub secret_key: String,
    pub database_url: String,
    pub mercury_api_key: String,
    pub rss_job_interval: Duration,
    pub default_limit: i64,
}

impl Config {
    pub fn new(secret_key: String, database_url: String, mercury_api_key: String, rss_job_interval: Duration, default_limit: i64) -> Self {
        Config { secret_key, database_url, mercury_api_key, rss_job_interval, default_limit }
    }

    pub fn from_env() -> Self {
        let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let mercury_api_key = env::var("MERCURY_API_KEY").expect("MERCURY_API_KEY must be set");
        let rss_job_interval = env::var("RSS_JOB_INTERVAL").expect("RSS_JOB_INTERVAL must be set");
        let rss_job_interval = rss_job_interval.parse::<u64>().expect("RSS_JOB_INTERVAL must be an integer");
        let rss_job_interval = Duration::from_secs(rss_job_interval);
        let default_limit = env::var("DEFAULT_LIMIT").expect("DEFAULT_LIMIT must be an integer");
        let default_limit = default_limit.parse().expect("DEFAULT_LIMIT must be an integer");
        Config::new(secret_key, database_url, mercury_api_key, rss_job_interval, default_limit)
    }
}

lazy_static! {
    pub static ref CONFIG: Config = {
        Config::from_env()
    };
}
