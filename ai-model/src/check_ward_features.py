import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

file_path = BASE_DIR / "dataset" / "hackathon_preli_dataset.xlsx"

df = pd.read_excel(file_path)

ward_features = (
    df.groupby(["city", "ward_id"])
    .agg({
        "sanitation_score": "first",
        "water_logging_risk_index": "first",
        "population_density_sqkm": "first"
    })
    .reset_index()
)

print(ward_features.to_string(index=False))