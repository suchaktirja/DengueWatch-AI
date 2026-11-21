from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .predict import predict_dengue

app = FastAPI(
    title="DengueWatch AI API",
    description="AI-powered Dengue Outbreak Prediction API",
    version="1.0.0"
)


class PredictionInput(BaseModel):
    population_density_sqkm: float
    water_logging_risk_index: float
    sanitation_score: float
    avg_temp_c: float
    max_temp_c: float
    min_temp_c: float
    rainfall_mm: float
    relative_humidity_pct: float
    dengue_cases: int

    rainfall_lag_1: float
    rainfall_lag_2: float
    rainfall_lag_3: float
    rainfall_lag_4: float

    dengue_lag_1: float
    dengue_lag_2: float
    dengue_lag_3: float
    dengue_lag_4: float

    month: int
    week_of_year: int

    city: str
    ward_id: str


@app.get("/")
def home():
    return {
        "message": "DengueWatch AI Prediction API is running!"
    }


@app.post("/predict")
def predict(input_data: PredictionInput):
    try:
        result = predict_dengue(input_data.model_dump())

        return {
            "status": "success",
            "city": input_data.city,
            "ward_id": input_data.ward_id,
            "predictions": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))