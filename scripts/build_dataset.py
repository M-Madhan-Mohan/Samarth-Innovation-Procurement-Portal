import os
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

PROCESSED_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")

print("[*] Building Feature Matrices & Machine Learning Training Corpuses...")

# 1. Load Clean Datasets
tenders_df = pd.read_csv(os.path.join(PROCESSED_DATA_DIR, "tenders_clean.csv"))
startups_df = pd.read_csv(os.path.join(PROCESSED_DATA_DIR, "startups_clean.csv"))
districts_df = pd.read_csv(os.path.join(PROCESSED_DATA_DIR, "districts_clean.csv"))
pilots_df = pd.read_csv(os.path.join(PROCESSED_DATA_DIR, "pilots_clean.csv"))

# 2. Extract TF-IDF Vectors for Startups vs Challenges
tfidf = TfidfVectorizer(stop_words="english", max_features=100)
tender_titles = tenders_df["title"].tolist()
startup_techs = startups_df["tech_stack"].tolist()

tfidf.fit(tender_titles + startup_techs)

matching_corpus = {
    "tenders": tenders_df.to_dict(orient="records"),
    "startups": startups_df.to_dict(orient="records"),
    "districts": districts_df.to_dict(orient="records"),
    "pilots": pilots_df.to_dict(orient="records"),
    "vocab_size": len(tfidf.vocabulary_)
}

with open(os.path.join(PROCESSED_DATA_DIR, "feature_matrix.json"), "w", encoding="utf-8") as f:
    json.dump(matching_corpus, f, indent=2)

print(f"[+] Feature matrix successfully constructed and stored at data/processed/feature_matrix.json")
