use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber;

#[derive(Clone)]
struct AppState {
    http_client: Client,
}

type SharedState = Arc<Mutex<AppState>>;


#[derive(Serialize, Deserialize, Debug)]
struct DriverStanding {
    position: i32,
    position_text: String,
    points: String,
    driver: DriverInfo,
    constructor: ConstructorInfo,
}

#[derive(Serialize, Deserialize, Debug)]
struct DriverInfo {
    code: String,
    given_name: String,
    family_name: String,
    nationality: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ConstructorInfo {
    name: String,
    nationality: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct RaceResult {
    race_name: String,
    date: String,
    results: Vec<DriverStanding>,
}

#[derive(Serialize, Deserialize, Debug)]
struct SessionData {
    session_key: i32,
    session_name: String,
    location: String,
    date_start: String,
    drivers: Vec<Driver>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Driver {
    driver_number: i32,
    full_name: String,
    team_name: String,
    country_code: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Position {
    driver_number: i32,
    position: i32,
    gap_to_leader: Option<String>,
    interval_to_leader: Option<String>,
    laps: i32,
}


async fn get_current_standings(State(state): State<SharedState>) -> Result<Json<Vec<DriverStanding>>, StatusCode> {
    
    let standings = vec![
        DriverStanding {
            position: 1,
            position_text: "1".to_string(),
            points: "72".to_string(),
            driver: DriverInfo {
                code: "ANT".to_string(),
                given_name: "Kimi".to_string(),
                family_name: "Antonelli".to_string(),
                nationality: "Italian".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Mercedes".to_string(),
                nationality: "German".to_string(),
            },
        },
        DriverStanding {
            position: 2,
            position_text: "2".to_string(),
            points: "63".to_string(),
            driver: DriverInfo {
                code: "RUS".to_string(),
                given_name: "George".to_string(),
                family_name: "Russell".to_string(),
                nationality: "British".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Mercedes".to_string(),
                nationality: "German".to_string(),
            },
        },
        DriverStanding {
            position: 3,
            position_text: "3".to_string(),
            points: "49".to_string(),
            driver: DriverInfo {
                code: "LEC".to_string(),
                given_name: "Charles".to_string(),
                family_name: "Leclerc".to_string(),
                nationality: "Monegasque".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Ferrari".to_string(),
                nationality: "Italian".to_string(),
            },
        },
        DriverStanding {
            position: 4,
            position_text: "4".to_string(),
            points: "41".to_string(),
            driver: DriverInfo {
                code: "HAM".to_string(),
                given_name: "Lewis".to_string(),
                family_name: "Hamilton".to_string(),
                nationality: "British".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Ferrari".to_string(),
                nationality: "Italian".to_string(),
            },
        },
        DriverStanding {
            position: 5,
            position_text: "5".to_string(),
            points: "25".to_string(),
            driver: DriverInfo {
                code: "NOR".to_string(),
                given_name: "Lando".to_string(),
                family_name: "Norris".to_string(),
                nationality: "British".to_string(),
            },
            constructor: ConstructorInfo {
                name: "McLaren".to_string(),
                nationality: "British".to_string(),
            },
        },
        DriverStanding {
            position: 6,
            position_text: "6".to_string(),
            points: "21".to_string(),
            driver: DriverInfo {
                code: "PIA".to_string(),
                given_name: "Oscar".to_string(),
                family_name: "Piastri".to_string(),
                nationality: "Australian".to_string(),
            },
            constructor: ConstructorInfo {
                name: "McLaren".to_string(),
                nationality: "British".to_string(),
            },
        },
        DriverStanding {
            position: 7,
            position_text: "7".to_string(),
            points: "17".to_string(),
            driver: DriverInfo {
                code: "BEA".to_string(),
                given_name: "Oliver".to_string(),
                family_name: "Bearman".to_string(),
                nationality: "British".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Haas".to_string(),
                nationality: "American".to_string(),
            },
        },
        DriverStanding {
            position: 8,
            position_text: "8".to_string(),
            points: "15".to_string(),
            driver: DriverInfo {
                code: "GAS".to_string(),
                given_name: "Pierre".to_string(),
                family_name: "Gasly".to_string(),
                nationality: "French".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Alpine".to_string(),
                nationality: "French".to_string(),
            },
        },
        DriverStanding {
            position: 9,
            position_text: "9".to_string(),
            points: "12".to_string(),
            driver: DriverInfo {
                code: "VER".to_string(),
                given_name: "Max".to_string(),
                family_name: "Verstappen".to_string(),
                nationality: "Dutch".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Red Bull Racing".to_string(),
                nationality: "Austrian".to_string(),
            },
        },
        DriverStanding {
            position: 10,
            position_text: "10".to_string(),
            points: "10".to_string(),
            driver: DriverInfo {
                code: "LAW".to_string(),
                given_name: "Liam".to_string(),
                family_name: "Lawson".to_string(),
                nationality: "New Zealander".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Racing Bulls".to_string(),
                nationality: "Austrian".to_string(),
            },
        },

        DriverStanding {
            position: 11,
            position_text: "11".to_string(),
            points: "2".to_string(),
            driver: DriverInfo {
                code: "ALB".to_string(),
                given_name: "Alex".to_string(),
                family_name: "Albon".to_string(),
                nationality: "Thai-British".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Williams".to_string(),
                nationality: "British".to_string(),
            },
        },
        DriverStanding {
            position: 12,
            position_text: "12".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "STR".to_string(),
                given_name: "Lance".to_string(),
                family_name: "Stroll".to_string(),
                nationality: "Canadian".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Aston Martin".to_string(),
                nationality: "British".to_string(),
            },
        },
        DriverStanding {
            position: 13,
            position_text: "13".to_string(),
            points: "2".to_string(),
            driver: DriverInfo {
                code: "BOT".to_string(),
                given_name: "Valtteri".to_string(),
                family_name: "Bottas".to_string(),
                nationality: "Finnish".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Audi".to_string(),
                nationality: "German".to_string(),
            },
        },
        DriverStanding {
            position: 14,
            position_text: "14".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "HUL".to_string(),
                given_name: "Nico".to_string(),
                family_name: "Hülkenberg".to_string(),
                nationality: "German".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Audi".to_string(),
                nationality: "German".to_string(),
            },
        },
        DriverStanding {
            position: 15,
            position_text: "15".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "COL".to_string(),
                given_name: "Franco".to_string(),
                family_name: "Colapinto".to_string(),
                nationality: "Argentinian".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Alpine".to_string(),
                nationality: "French".to_string(),
            },
        },
        DriverStanding {
            position: 16,
            position_text: "16".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "DOO".to_string(),
                given_name: "Mike".to_string(),
                family_name: "Doohan".to_string(),
                nationality: "Australian".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Alpine".to_string(),
                nationality: "French".to_string(),
            },
        },
        DriverStanding {
            position: 17,
            position_text: "17".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "TSU".to_string(),
                given_name: "Yuki".to_string(),
                family_name: "Tsunoda".to_string(),
                nationality: "Japanese".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Red Bull Racing".to_string(),
                nationality: "Austrian".to_string(),
            },
        },
        DriverStanding {
            position: 18,
            position_text: "18".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "MAG".to_string(),
                given_name: "Kevin".to_string(),
                family_name: "Magnussen".to_string(),
                nationality: "Danish".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Haas".to_string(),
                nationality: "American".to_string(),
            },
        },
        DriverStanding {
            position: 19,
            position_text: "19".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "OCO".to_string(),
                given_name: "Esteban".to_string(),
                family_name: "Ocon".to_string(),
                nationality: "French".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Haas".to_string(),
                nationality: "American".to_string(),
            },
        },
        DriverStanding {
            position: 20,
            position_text: "20".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "SIM".to_string(),
                given_name: "Marcus".to_string(),
                family_name: "Sainz".to_string(),
                nationality: "Spanish".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Williams".to_string(),
                nationality: "British".to_string(),
            },
        },

        DriverStanding {
            position: 21,
            position_text: "21".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "SCH".to_string(),
                given_name: "Mick".to_string(),
                family_name: "Schumacher".to_string(),
                nationality: "German".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Cadillac".to_string(),
                nationality: "American".to_string(),
            },
        },
        DriverStanding {
            position: 22,
            position_text: "22".to_string(),
            points: "0".to_string(),
            driver: DriverInfo {
                code: "DRU".to_string(),
                given_name: "Jack".to_string(),
                family_name: "Druen".to_string(),
                nationality: "New Zealander".to_string(),
            },
            constructor: ConstructorInfo {
                name: "Cadillac".to_string(),
                nationality: "American".to_string(),
            },
        },
    ];

    Ok(Json(standings))
}


async fn get_current_race(State(state): State<SharedState>) -> Result<Json<serde_json::Value>, StatusCode> {
    // Fetch from OpenF1 API
    let url = "https://api.openf1.org/v1/sessions?session_name=Race&year=2026";
    
    let client = state.lock().await.http_client.clone();
    match client.get(url).send().await {
        Ok(response) => {
            if let Ok(data) = response.json::<serde_json::Value>().await {
                return Ok(Json(data));
            }
        }
        Err(e) => {
            tracing::warn!("Failed to fetch from OpenF1: {}", e);
        }
    }

   
    let race_info = serde_json::json!({
        "race_name": "Miami Grand Prix",
        "location": "Miami International Autodrome",
        "date": "2026-05-02",
        "winner": "TBD"
    });

    Ok(Json(race_info))
}


async fn get_live_positions(State(state): State<SharedState>) -> Result<Json<Vec<Position>>, StatusCode> {
   
    let url = "https://api.openf1.org/v1/position?session_key=latest";
    
    let client = state.lock().await.http_client.clone();
    match client.get(url).send().await {
        Ok(response) => {
            if let Ok(positions) = response.json::<Vec<Position>>().await {
                return Ok(Json(positions));
            }
        }
        Err(e) => {
            tracing::warn!("Failed to fetch live positions: {}", e);
        }
    }


    let positions = vec![
        Position {
            driver_number: 12,
            position: 1,
            gap_to_leader: None,
            interval_to_leader: None,
            laps: 45,
        },
        Position {
            driver_number: 63,
            position: 2,
            gap_to_leader: Some("+3.441".to_string()),
            interval_to_leader: Some("+3.441".to_string()),
            laps: 45,
        },
    ];

    Ok(Json(positions))
}


async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "ok",
        "service": "F1 API",
        "version": "0.1.0"
    }))
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let state = Arc::new(Mutex::new(AppState {
        http_client: Client::new(),
    }));

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/standings", get(get_current_standings))
        .route("/api/current-race", get(get_current_race))
        .route("/api/positions", get(get_live_positions))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    tracing::info!("F1 API server running on http://0.0.0.0:3001");

    axum::serve(listener, app).await.unwrap();
}
