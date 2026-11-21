import pandas as pd
from pathlib import Path
# Load the Excel dataset
BASE_DIR = Path(__file__).resolve().parents[1]

file_path = BASE_DIR / "dataset" / "hackathon_preli_dataset.xlsx"

df = pd.read_excel(file_path)

# Display basic information
print("\n========== DATASET OVERVIEW ==========")

print("\nFirst 5 Rows:")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns.tolist())

print("\nData Types:")
print(df.dtypes)

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:")
print(df.duplicated().sum())

print("\nDataset Information:")
df.info()