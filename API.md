# MIPP API Documentation Reference (`API.md`)

Base URL: `http://localhost:8000/api/v1`

---

## 1. Challenge Copilot APIs

### `POST /mipp/challenges/generate-copilot`
Converts government operational problem statements into 23 outcome-based fields + Quality Assessment Score.
- **Request Body**:
  ```json
  { "prompt": "Traffic congestion near schools in Pune is causing delays and safety problems." }
  ```
- **Response**:
  ```json
  {
    "title": "AI-Driven Adaptive Traffic Control & Safety in Pune School Zones",
    "department": "Urban Development Department, Maharashtra",
    "domain": "transport",
    "primary_kpi": "Average peak congestion delay",
    "baseline_value": "18.0 minutes delay",
    "target_value": "12.0 minutes delay or lower",
    "quality_score": 92
  }
  ```

### `POST /mipp/challenges/assess-quality`
Returns 7-dimension quality score breakdown and recommendations.

---

## 2. Startup & Passport APIs

### `GET /mipp/startups/{startup_id}/passport`
Returns Startup Capability Passport (Identity, Capability, Tech, Security, Readiness) and Verified Pilot Passport.

### `GET /mipp/startups/demand-radar`
Returns statewide government challenge demand across sectors and districts.

---

## 3. Startup-Challenge Matching APIs

### `GET /mipp/matching/challenge/{challenge_id}`
Returns explainable match scores, 7-dimension breakdown (Tech 30, Domain 20, Readiness 15, Cost 10, Geo 10, Security 10, Team 5), strengths, and weaknesses.

---

## 4. Evaluation APIs

### `POST /mipp/evaluations/conflict-check`
Checks conflict of interest declaration. If conflict declared, automatically blocks assignment and returns audit record.

---

## 5. Pilot Control Tower APIs

### `GET /mipp/pilots/{pilot_id}`
Returns Pilot Control Tower status flow, milestones (M1..M5), released budget, and live KPI performance.

### `POST /mipp/pilots/{pilot_id}/milestones/{milestone_id}/release-payment`
Triggers simulated PFMS milestone payment disbursement.

---

## 6. Evidence Verification APIs

### `GET /mipp/evidence/pilot/{pilot_id}`
Returns 4-way side-by-side comparison matrix (Startup Claim vs Govt Observed Data vs Evaluator Score vs Independent Validator), verified result, confidence, and SHA-256 integrity checksum.

---

## 7. Scale & Replication APIs

### `GET /mipp/scale/assessment/{pilot_id}`
Returns Scale Readiness Scorecard (92/100 READY FOR SCALE) and Cross-District Replication recommendations (Nashik, Nagpur, Thane, etc.).

---

## 8. ML & Dataset Center APIs

### `GET /mipp/ml/transparency`
Returns ML Model Registry metrics (NDCG@5, F1, Accuracy, Latency).

### `GET /mipp/ml/datasets`
Returns Ingested Public Datasets log (`DS-01` to `DS-06`).

### `POST /mipp/ml/retrain`
Triggers model retraining pipeline on processed feature matrix.
