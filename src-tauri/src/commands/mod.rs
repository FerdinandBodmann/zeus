// Models module
pub mod models {
    #[derive(serde::Serialize, serde::Deserialize)]
    pub struct AppConfig {
        pub theme: String,
        pub language: String,
    }
}

pub mod services {}
pub mod mcp {}
pub mod commands {}
