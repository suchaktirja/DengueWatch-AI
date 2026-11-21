import joblib
import pandas as pd
from pathlib import Path

from .risk_classifier import classify_risk

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "models"

FEATURES = [
    "population_density_sqkm",
    "water_logging_risk_index",
    "sanitation_score",
    "avg_temp_c",
    "max_temp_c",
    "min_temp_c",
    "rainfall_mm",
    "relative_humidity_pct",
    "dengue_cases",
    "rainfall_lag_1",
    "rainfall_lag_2",
    "rainfall_lag_3",
    "rainfall_lag_4",
    "dengue_lag_1",
    "dengue_lag_2",
    "dengue_lag_3",
    "dengue_lag_4",
    "month",
    "week_of_year",
    "city",
    "ward_id"
]


def load_models():
    models = {}

    for horizon in [2, 3, 4]:
        model_path = MODEL_DIR / f"dengue_model_{horizon}w.joblib"
        models[horizon] = joblib.load(model_path)

    return models


def predict_dengue(input_data):

    models = load_models()

    input_df = pd.DataFrame([input_data])
    input_df = input_df[FEATURES]

    results = {}

    for horizon in [2, 3, 4]:

        prediction = models[horizon].predict(input_df)[0]
        prediction = max(0, round(float(prediction)))

        risk = classify_risk(prediction, horizon)

        results[f"{horizon}_weeks"] = {
            "predicted_cases": round(prediction, 2),
            "risk_level": risk
        }

    return results


if __name__ == "__main__":

    data_path = BASE_DIR / "dataset" / "processed_dengue_data.csv"

    df = pd.read_csv(data_path, parse_dates=["date"])

    # Get the latest available ward record
    latest = df.sort_values("date").iloc[-1].copy()

    # Generate time-based features
    latest["month"] = latest["date"].month
    latest["week_of_year"] = latest["date"].isocalendar().week

    input_data = latest[FEATURES].to_dict()

    print("Selected City:", input_data["city"])
    print("Selected Ward:", input_data["ward_id"])
    print("Prediction Results:")

    results = predict_dengue(input_data)

    for period, result in results.items():
        print(f"\n{period}:")
        print("Predicted Cases:", result["predicted_cases"])
        print("Risk Level:", result["risk_level"])