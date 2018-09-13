use envconfig::Envconfig;

#[derive(Debug, Clone, Envconfig)]
pub struct Config {
  #[from="SECRET_KEY"]
  pub secret_key: String,
  #[from="DATABASE_URL"]
  pub database_url: String,
  #[from="MERCURY_API_KEY"]
  pub mercury_api_key: String,
  #[from="RSS_JOB_INTERVAL"]
  pub rss_job_interval: u64,
  #[from="DEFAULT_LIMIT"]
  pub default_limit: i64,
  #[from="HOST"]
  pub host: String,
  #[from="PORT"]
  pub port: usize,
}

lazy_static! {
  pub static ref CONFIG: Config = {
    Config::init_or_die()
  };
}
