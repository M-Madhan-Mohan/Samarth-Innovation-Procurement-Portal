# MIPP — Dataset & Preprocessing Pipeline Specification (`DATASET.md`)

## 1. Overview
This document specifies the data pipeline architecture for the **MIPP Machine Learning Suite**. The pipeline ingests raw open public datasets (`DS-01` through `DS-06`), performs automated cleaning, feature engineering, train/val/test splitting, and outputs reproducible serialized dataset artifacts in `data/processed/`.

---

## 2. Directory Structure

```
c:\Users\mm428\OneDrive\Desktop\sih full project\
├── data/
│   ├── raw/
│   │   ├── tenders_public.csv
│   │   ├── startups_dpiit.csv
│   │   ├── mobility_pune.csv
│   │   ├── districts_maharashtra.csv
│   │   ├── pilot_outcomes.csv
│   │   └── evidence_logs.csv
│   └── processed/
│       ├── matching_features.json
│       ├── quality_features.json
│       ├── pilot_risk_features.json
│       ├── evidence_confidence_features.json
│       ├── scale_readiness_features.json
│       └── replication_features.json
```

---

## 3. Preprocessing Steps

1. **Ingestion & Validation**:
   - Verify non-empty schema.
   - Enforce typing (e.g. numeric budget, boolean flags, datetime stamps).

2. **Deduplication & Missing Value Treatment**:
   - Exact and fuzzy deduplication on company names and tender titles.
   - Numerical missing values imputed using median per domain.
   - Text fields filled with empty strings before TF-IDF vectorization.

3. **Feature Engineering**:
   - **Text Vectors**: TF-IDF (1000 max features, 1-2 n-grams) on challenge problem statements and startup summaries.
   - **Capability Scaling**: MinMaxScaler on team size, past pilots, and budget requested.
   - **Category One-Hot**: Domain (Agriculture, Transport, Cleantech, Governance, Healthcare), Stage, District.
   - **Distance Metrics**: Spatial cosine similarity for cross-district replication.

4. **Data Leakage Prevention**:
   - Temporal split for pilot performance data (Historical pilots in Train, recent pilots in Test).
   - Strict separation between pre-pilot proposal features and post-pilot actual outcome indicators.

---

## 4. Dataset Generation Scripts

- `python scripts/download_data.py`: Downloads or instantiates raw public open datasets.
- `python scripts/clean_data.py`: Performs cleaning, deduplication, and schema validation.
- `python scripts/build_dataset.py`: Generates the processed feature matrices for model training.
