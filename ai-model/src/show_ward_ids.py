
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

file_path = BASE_DIR / "dataset" / "hackathon_preli_dataset.xlsx"

df = pd.read_excel(file_path)

ward_mapping = (
    df[["city", "ward_id"]]
    .drop_duplicates()
    .sort_values(["city", "ward_id"])
)

print("Total unique wards:", len(ward_mapping))
print("\nTraining Ward IDs:")
print(ward_mapping.to_string(index=False))
