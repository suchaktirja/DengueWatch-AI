import pandas as pd
from pathlib import Path

# Project directory
BASE_DIR = Path(__file__).resolve().parents[1]

# Load dataset
file_path = BASE_DIR / "dataset" / "hackathon_preli_dataset.xlsx"

df = pd.read_excel(file_path)

# Sort data chronologically for each ward
df = df.sort_values(
    ["city", "ward_id", "date"]
).reset_index(drop=True)

# Group by city and ward
grouped = df.groupby(["city", "ward_id"])

# Create rainfall lag features
for lag in range(1, 5):
    df[f"rainfall_lag_{lag}"] = grouped["rainfall_mm"].shift(lag)

# Create previous dengue case features
grouped = df.groupby(["city", "ward_id"])

for lag in range(1, 5):
    df[f"dengue_lag_{lag}"] = grouped["dengue_cases"].shift(lag)

# Create future prediction targets
grouped = df.groupby(["city", "ward_id"])

for week in [2, 3, 4]:
    df[f"target_{week}w"] = grouped["dengue_cases"].shift(-week)

# Remove rows without sufficient historical or future data
df = df.dropna().reset_index(drop=True)

# Save processed dataset
output_path = BASE_DIR / "dataset" / "processed_dengue_data.csv"

df.to_csv(output_path, index=False)

print("Feature Engineering Completed!")

print("Processed Dataset Shape:", df.shape)

print("\nNew Features:")
print([
    col for col in df.columns
    if "lag" in col or "target" in col
])

print("\nSaved at:", output_path)
print("\nDate Range:")
print(df["date"].min(), "to", df["date"].max())

print("\nMissing Values:")
print(df.isnull().sum().sum())

print("\nProcessed Dataset Preview:")
print(df.head())

print("\nFinal Columns:")
print(df.columns.tolist())