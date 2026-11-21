import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

file_path = BASE_DIR / "dataset" / "hackathon_preli_dataset.xlsx"

df = pd.read_excel(file_path)

columns = [
    "sanitation_score",
    "water_logging_risk_index",
    "avg_temp_c",
    "max_temp_c",
    "min_temp_c",
    "population_density_sqkm"
]

for col in columns:
    print(f"\n===== {col} =====")
    print("Minimum:", df[col].min())
    print("Maximum:", df[col].max())
    print("Average:", df[col].mean())