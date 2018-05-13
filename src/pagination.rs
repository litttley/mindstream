use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct Pagination {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct PaginationWithRssSourceUuid {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub rss_source_uuid: Option<Uuid>,
}
