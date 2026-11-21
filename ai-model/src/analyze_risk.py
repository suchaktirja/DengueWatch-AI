import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

file_path = BASE_DIR / "dataset" / "processed_dengue_data.csv"

df = pd.read_csv(file_path)

print("Dengue Cases Distribution:")
print(df["dengue_cases"].describe())

print("\nPercentiles:")

for p in [25, 50, 75, 90, 95, 99]:
    value = df["dengue_cases"].quantile(p / 100)
    print(f"{p}th percentile: {value}")

print("\nUnique Dengue Case Values:")
print(df["dengue_cases"].nunique())