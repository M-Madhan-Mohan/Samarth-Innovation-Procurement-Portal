import os
import pandas as pd

RAW_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "raw")
PROCESSED_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")
os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)

print("[*] Running Data Cleaning & Preprocessing Pipeline...")

# Clean Tenders
tenders_df = pd.read_csv(os.path.join(RAW_DATA_DIR, "tenders_public.csv"))
tenders_df.drop_duplicates(subset=["tender_id"], inplace=True)
tenders_df["budget_inr"] = tenders_df["budget_inr"].fillna(tenders_df["budget_inr"].median())

# Clean Startups
startups_df = pd.read_csv(os.path.join(RAW_DATA_DIR, "startups_dpiit.csv"))
startups_df.drop_duplicates(subset=["startup_id"], inplace=True)
startups_df["team_size"] = startups_df["team_size"].fillna(10)

# Clean Districts
districts_df = pd.read_csv(os.path.join(RAW_DATA_DIR, "districts_maharashtra.csv"))
districts_df.drop_duplicates(subset=["district_name"], inplace=True)

# Clean Pilots
pilots_df = pd.read_csv(os.path.join(RAW_DATA_DIR, "pilot_outcomes.csv"))

# Save Cleaned DataFrames
tenders_df.to_csv(os.path.join(PROCESSED_DATA_DIR, "tenders_clean.csv"), index=False)
startups_df.to_csv(os.path.join(PROCESSED_DATA_DIR, "startups_clean.csv"), index=False)
districts_df.to_csv(os.path.join(PROCESSED_DATA_DIR, "districts_clean.csv"), index=False)
pilots_df.to_csv(os.path.join(PROCESSED_DATA_DIR, "pilots_clean.csv"), index=False)

print("[+] Cleaned datasets saved to data/processed/")
