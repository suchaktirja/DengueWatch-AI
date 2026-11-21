import os
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

from .predict import predict_dengue, FEATURES

BASE_DIR = Path(__file__).resolve().parents[1]

load_dotenv(BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_data():

    wards = supabase.table("wards").select("*").execute().data
    weather = supabase.table("weather_data").select("*").execute().data
    dengue = supabase.table("dengue_cases").select("*").execute().data

    wards_df = pd.DataFrame(wards)
    weather_df = pd.DataFrame(weather)
    dengue_df = pd.DataFrame(dengue)

    weather_df = weather_df.rename(columns={
        "observation_date": "date",
        "temperature_avg_c": "avg_temp_c",
        "temperature_max_c": "max_temp_c",
        "temperature_min_c": "min_temp_c",
        "humidity_pct": "relative_humidity_pct"
    })

    dengue_df = dengue_df.rename(columns={
        "report_date": "date",
        "reported_cases": "dengue_cases"
    })

    df = pd.merge(
        weather_df,
        dengue_df[["ward_id", "date", "dengue_cases"]],
        on=["ward_id", "date"],
        how="inner"
    )

    df = pd.merge(
        df,
        wards_df[[
            "id", "city", "population_density",
            "sanitation_score", "water_logging_risk"
        ]],
        left_on="ward_id",
        right_on="id",
        how="left"
    )

    df = df.rename(columns={
        "population_density": "population_density_sqkm"
    })

    # Convert static ward features
    df["sanitation_score"] = pd.to_numeric(
    df["sanitation_score"], errors="coerce"
).astype(float)

    df["sanitation_score"] = pd.to_numeric(
        df["sanitation_score"], errors="coerce"
    ).astype(float)

    df["sanitation_score"] = df["sanitation_score"].apply(
        lambda x: x / 100 if pd.notna(x) and x > 1 else x
    )

    risk_mapping = {
        "Low": 0.25,
        "Moderate": 0.50,
        "High": 0.75,
        "Severe": 0.90
    }

    df["water_logging_risk_index"] = df[
        "water_logging_risk"
    ].map(risk_mapping)
    df["date"] = pd.to_datetime(df["date"])

    return df


def prepare_weekly_data(df):

    df["week_start"] = (
        df["date"] -
        pd.to_timedelta(df["date"].dt.weekday, unit="D")
    )

    weekly = (
        df.groupby(["city", "ward_id", "week_start"])
        .agg({
            "population_density_sqkm": "first",
            "water_logging_risk_index": "first",
            "sanitation_score": "first",
            "avg_temp_c": "mean",
            "rainfall_mm": "sum",
            "relative_humidity_pct": "mean",
            "dengue_cases": "sum"
        })
        .reset_index()
    )

    # Temporary approximation for missing temperature columns.
    # Replace with actual max/min temperature data when available.
    weekly["max_temp_c"] = weekly["avg_temp_c"]
    weekly["min_temp_c"] = weekly["avg_temp_c"]

    weekly = weekly.sort_values(
        ["city", "ward_id", "week_start"]
    )

    for lag in range(1, 5):

        weekly[f"rainfall_lag_{lag}"] = (
            weekly.groupby(["city", "ward_id"])["rainfall_mm"]
            .shift(lag)
        )

        weekly[f"dengue_lag_{lag}"] = (
            weekly.groupby(["city", "ward_id"])["dengue_cases"]
            .shift(lag)
        )

    weekly["month"] = weekly["week_start"].dt.month

    weekly["week_of_year"] = (
        weekly["week_start"].dt.isocalendar().week.astype(int)
    )

    return weekly


def main():

    print("Fetching Supabase data...")

    df = fetch_data()

    print("Preparing weekly data...")

    weekly = prepare_weekly_data(df)

    # Get latest complete input row for each ward
    latest_rows = (
        weekly.dropna(subset=FEATURES)
        .sort_values("week_start")
        .groupby(["city", "ward_id"])
        .tail(1)
    )

    if latest_rows.empty:
        print("Not enough historical data to generate predictions.")
        return

    for _, row in latest_rows.iterrows():

        input_data = row[FEATURES].to_dict()

        print("\n------------------------------")
        print("City:", input_data["city"])
        print("Ward:", input_data["ward_id"])

        results = predict_dengue(input_data)

        for period, result in results.items():

            print(f"\n{period}:")
            print("Predicted Cases:", result["predicted_cases"])
            print("Risk Level:", result["risk_level"])


if __name__ == "__main__":
    main()