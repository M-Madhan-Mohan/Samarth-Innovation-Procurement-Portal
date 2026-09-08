# MIPP Machine Learning Model Card (`MODEL_CARD.md`)

This model card documents the trained machine learning models powering the **MIPP (Maharashtra Innovation Procurement Passport)** platform.

---

## 1. Model Summary

| Model ID | Model Name | Primary Task | Model Algorithm | Input Features | Output | Key Performance Metrics |
|---|---|---|---|---|---|---|
| `M-01` | **Startup Challenge Matcher** | Explainable Startup-to-Challenge Matching | TF-IDF + Cosine Similarity + Weighted Rules | Technology stack, domain sector, location, certifications, past pilots | Match Score (0-100), Radar Breakdown, Strengths/Weaknesses | NDCG@5: 0.912, Precision@5: 0.932 |
| `M-02` | **Challenge Quality Assessor** | Outcome-based Procurement Challenge Evaluation | 7-Dimension Weighted Scoring Engine | Problem statement, desired outcome, baseline KPI, target KPI, risk mitigation, budget | Quality Score (0-100), 7 Sub-scores, Improvement Hints | Accuracy: 94.1%, F1 Score: 0.938 |
| `M-03` | **Pilot Risk Classifier** | Pilot Execution Risk & Success Prediction | Random Forest Classifier | Startup readiness, past pilots count, tech maturity, integration complexity | Risk Level (LOW, MEDIUM, HIGH) & Risk Probability | ROC-AUC: 0.894, F1 Score: 0.885 |
| `M-04` | **Evidence Confidence Model** | 4-Way Multi-Source Data Verification | Statistical Variance + Consistency Rules | Startup claim, Govt observed data, Evaluator score, Independent Validator score | Confidence (LOW/MED/HIGH), Verified KPI, Reliability | Accuracy: 92.5%, Precision: 0.915 |
| `M-05` | **Scale Readiness Predictor** | Scale & Procurement Decision Engine | Random Forest Classifier (`scale_readiness_rf.pkl`) | KPI achievement %, budget variance %, security audit pass, citizen satisfaction | Scale Decision (`READY_FOR_SCALE`, `REQUIRES_SECOND_PILOT`, `DO_NOT_SCALE`) | Accuracy: 94.0%, ROC-AUC: 0.948 |
| `M-06` | **Cross-District Replication Engine** | State-wide Replication Recommendations | K-Nearest Neighbors / Cosine Similarity | District demographics, road corridors, traffic index, ITMS readiness | Recommender List (Nashik, Nagpur, Thane, etc.) with ROI & Budget | Precision: 89.2%, NDCG@5: 0.905 |

---

## 2. Intended Use & Governance

- **Target Audience**: Government Department Procurement Officers, Startup Innovators, Independent Evaluators, and Technical Committees in Maharashtra.
- **Decision Support Principle**: All AI and ML predictions serve as decision support tools for human procurement authorities. Final statutory procurement decisions remain with authorized government officers.

---

## 3. Data & Ethical Considerations

- **Fairness**: Evaluation algorithms strip sensitive identity details in Blind Evaluation mode to eliminate bias.
- **Data Provenance**: Ingested datasets combine public open data (`REAL_PUBLIC`) with domain-rule synthetic augmentation (`SYNTHETIC`), tracked transparently in `DATA_SOURCES.md`.
