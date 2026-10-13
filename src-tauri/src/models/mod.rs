pub mod models {
    #[derive(serde::Serialize, serde::Deserialize)]
    pub struct ApiKey {
        pub id: String,
        pub name: String,
        pub provider_id: String,
        pub created_at: String,
    }
}