import os
import pandas as pd

from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

tables = {
    "weather_data": "observation_date",
    "dengue_cases": "report_date"
}

for table, date_column in tables.items():

    response = (
        supabase.table(table)
        .select("*")
        .execute()
    )

    df = pd.DataFrame(response.data)

    print(f"\n===== {table.upper()} =====")

    print("Total records:", len(df))

    print("\nRecords per ward:")
    print(df.groupby("ward_id").size())

    print("\nDate range:")
    print("Start:", df[date_column].min())
    print("End:", df[date_column].max())

    print("\nUnique dates:")
    print(df[date_column].nunique())

    print("\nMissing values:")
    print(df.isnull().sum())

    print("\nDate samples:")
    print(sorted(df[date_column].unique())[:15])