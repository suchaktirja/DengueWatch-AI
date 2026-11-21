import pandas as pd
import json

from pathlib import Path

# Project directory
BASE_DIR = Path(__file__).resolve().parents[1]

# Load processed dataset
data_path = BASE_DIR / "dataset" / "processed_dengue_data.csv"

df = pd.read_csv(data_path, parse_dates=["date"])

# Use training period only
train = df[df["date"] <= "2022-11-28"].copy()

thresholds = {}

for horizon in [2, 3, 4]:

    target = f"target_{horizon}w"

    # Consider positive dengue cases only
    positive_cases = train.loc[train[target] > 0, target]

    # Calculate data-driven thresholds
    p75 = float(positive_cases.quantile(0.75))
    p95 = float(positive_cases.quantile(0.95))

    thresholds[f"{horizon}w"] = {
        "medium_max": p75,
        "high_max": p95
    }

    print(f"\n{horizon} Weeks Ahead:")
    print("Medium maximum:", p75)
    print("High maximum:", p95)
    print("Critical:", f"Above {p95}")


# Save thresholds
output_path = BASE_DIR / "models" / "risk_thresholds.json"

with open(output_path, "w") as file:
    json.dump(thresholds, file, indent=4)

print("\nRisk thresholds saved:", output_path)