import pandas as pd
import numpy as np
import joblib

from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


# Project directory
BASE_DIR = Path(__file__).resolve().parents[1]

# Load processed dataset
data_path = BASE_DIR / "dataset" / "processed_dengue_data.csv"

df = pd.read_csv(data_path, parse_dates=["date"])


# Create seasonal features
df["month"] = df["date"].dt.month
df["week_of_year"] = df["date"].dt.isocalendar().week.astype(int)


# Feature columns
numeric_features = [
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

categorical_features = ["city", "ward_id"]

features = numeric_features + categorical_features


# Chronological split with a gap
train = df[df["date"] <= "2022-11-28"]

validation = df[
    (df["date"] >= "2023-01-02") &
    (df["date"] <= "2024-12-02")
]

test = df[df["date"] >= "2025-01-06"]


print("Training rows:", len(train))
print("Validation rows:", len(validation))
print("Testing rows:", len(test))


# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ("num", "passthrough", numeric_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)


# Create models folder
models_dir = BASE_DIR / "models"
models_dir.mkdir(exist_ok=True)


# Train three models
for horizon in [2, 3, 4]:

    target = f"target_{horizon}w"

    X_train = train[features]
    y_train = train[target]

    X_val = validation[features]
    y_val = validation[target]

    X_test = test[features]
    y_test = test[target]

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(
            n_estimators=200,
            random_state=42,
            n_jobs=-1
        ))
    ])

    # Train
    model.fit(X_train, y_train)

    # Validation prediction
    val_predictions = model.predict(X_val)

    val_mae = mean_absolute_error(y_val, val_predictions)
    val_rmse = np.sqrt(mean_squared_error(y_val, val_predictions))

    # Test prediction
    test_predictions = model.predict(X_test)

    test_mae = mean_absolute_error(y_test, test_predictions)
    test_rmse = np.sqrt(mean_squared_error(y_test, test_predictions))

    # Save model
    model_path = models_dir / f"dengue_model_{horizon}w.joblib"

    joblib.dump(model, model_path)

    print(f"\n===== {horizon} WEEKS AHEAD =====")

    print("Validation MAE:", round(val_mae, 3))
    print("Validation RMSE:", round(val_rmse, 3))

    print("Test MAE:", round(test_mae, 3))
    print("Test RMSE:", round(test_rmse, 3))

    print("Model saved:", model_path)


print("\nAll models trained successfully!")