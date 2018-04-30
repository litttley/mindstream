use uuid::Uuid;
use schema::users_rss_sources;

#[derive(Debug, PartialEq, Deserialize, Serialize, Identifiable, Queryable, Insertable)]
#[primary_key(uuid)]
#[table_name="users_rss_sources"]
pub struct UserRssSource {
    pub uuid: Uuid,
    pub user_uuid: Uuid,
    pub rss_source_uuid: Uuid,
}

impl UserRssSource {
    pub fn new(user_uuid: Uuid, rss_source_uuid: Uuid) -> Self {
        UserRssSource { uuid: Uuid::new_v4(), user_uuid, rss_source_uuid }
    }
}
