
import pandas as pd


# Model input features
NUMERIC_FEATURES = [
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
    "week_of_year"
]

CATEGORICAL_FEATURES = [
    "city",
    "ward_id"
]

MODEL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def prepare_ward_data(wards, weather_data, dengue_cases):
    """
    Prepare Supabase records for DengueWatch AI.

    Input:
        wards       : records from wards table
        weather_data: records from weather_data table
        dengue_cases: records from dengue_cases table

    Output:
        Prepared DataFrame containing model input features.
    """

    # Convert Supabase records into DataFrames
    wards_df = pd.DataFrame(wards)
    weather_df = pd.DataFrame(weather_data)
    dengue_df = pd.DataFrame(dengue_cases)

    # Validate required tables
    if wards_df.empty:
        raise ValueError("No ward records found.")

    if weather_df.empty:
        raise ValueError("No weather records found.")

    if dengue_df.empty:
        raise ValueError("No dengue records found.")

    # Rename columns to match training dataset
    wards_df = wards_df.rename(columns={
        "id": "ward_id",
        "population_density": "population_density_sqkm"
    })

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

    # Convert dates
    weather_df["date"] = pd.to_datetime(weather_df["date"])
    dengue_df["date"] = pd.to_datetime(dengue_df["date"])

    # Merge ward information
    df = weather_df.merge(
        wards_df[
            [
                "ward_id",
                "city",
                "population_density_sqkm",
                "sanitation_score",
                "water_logging_risk"
            ]
        ],
        on="ward_id",
        how="left"
    )

    # Merge dengue records
    df = df.merge(
        dengue_df[
            ["ward_id", "date", "dengue_cases"]
        ],
        on=["ward_id", "date"],
        how="left",
        validate="one_to_one"
    )

    # Validate merged data
    if df["dengue_cases"].isna().any():
        raise ValueError(
            "Some weather records have no matching dengue records."
        )

    # Check whether water logging is already numeric
    if not pd.api.types.is_numeric_dtype(df["water_logging_risk"]):
        raise ValueError(
            "Water logging mapping is required before model prediction."
        )

    df = df.rename(columns={
        "water_logging_risk": "water_logging_risk_index"
    })

    # Sort records chronologically per ward
    df = df.sort_values(
        ["city", "ward_id", "date"]
    ).reset_index(drop=True)

    # Create lag features
    grouped = df.groupby(["city", "ward_id"])

    for lag in range(1, 5):
        df[f"rainfall_lag_{lag}"] = (
            grouped["rainfall_mm"].shift(lag)
        )

    for lag in range(1, 5):
        df[f"dengue_lag_{lag}"] = (
            grouped["dengue_cases"].shift(lag)
        )

    # Create seasonal features
    df["month"] = df["date"].dt.month

    df["week_of_year"] = (
        df["date"].dt.isocalendar().week.astype(int)
    )

    # Remove rows without sufficient historical data
    df = df.dropna(
        subset=MODEL_FEATURES
    ).reset_index(drop=True)

    if df.empty:
        raise ValueError(
            "Not enough historical records to create model features."
        )

    # Final feature validation
    missing_features = [
        feature for feature in MODEL_FEATURES
        if feature not in df.columns
    ]

    if missing_features:
        raise ValueError(
            f"Missing model features: {missing_features}"
        )

    return df[MODEL_FEATURES + ["date"]]
if __name__ == "__main__":
    print("Supabase preprocessing module loaded successfully!")
    print("Total model features:", len(MODEL_FEATURES))
    print("Features:", MODEL_FEATURES)