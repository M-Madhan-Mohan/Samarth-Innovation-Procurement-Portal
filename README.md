# Samarth-Innovation-Procurement-Portal
AI-powered innovation procurement platform that helps Maharashtra government departments discover eligible startups, evaluate solutions, run controlled pilots, verify outcomes, and scale successful innovations through a transparent, milestone-based procurement workflow.

> **SIH 2026 Problem Statement ID**: 26136  
> **Title**: Startup friendly public procurement mechanism that enables government departments to identify, pilot, procure, and scale innovative solutions from eligible startups  
> **Organization**: Government of Maharashtra — Maharashtra State Innovation Society (MSINS)  
> **Tagline**: *"From Government Problem to Verified Startup Solution — and from Pilot to Scale."*

---

## Executive Overview

**MIPP (Maharashtra Innovation Procurement Passport)** is an enterprise **Innovation Procurement Operating System**. Unlike conventional tender portals that treat startups like legacy contractors, MIPP structures the entire innovation lifecycle into an evidence-based, risk-mitigated journey:

```
Government Problem 
       ↓ 
AI Challenge Copilot (23 fields + Quality Score) 
       ↓ 
Startup Capability Passport & AI Matching Engine (7 weighted dimensions) 
       ↓ 
Blind & Conflict-Aware Expert Evaluation (3 independent evaluators + calibration) 
       ↓ 
Pilot Control Tower & Milestone Payments (RAG indicators + simulated PFMS tranches) 
       ↓ 
4-Way Evidence Verification (Startup vs Govt vs Evaluators vs Independent Validator) 
       ↓ 
Scale Readiness Engine (92/100 READY FOR SCALE) 
       ↓ 
Cross-District Replication Engine (Pune → Nashik, Nagpur, Thane, etc.)
```

---

## Core System Architecture & Highlights

1. **AI Challenge Copilot**: Converts operational problems into 23 outcome-based fields + Quality Assessment Scorecard (0-100).
2. **AI Startup Matching Engine**: Explainable 7-dimension match score (Tech 30, Domain 20, Readiness 15, Cost 10, Geo 10, Security 10, Team 5) with explicit strengths & weaknesses.
3. **Startup Capability & Pilot Passport**: Reusable verified pilot records for fast-track government scaling.
4. **Blind + Conflict-Aware Expert Evaluation**: Blind proposal scoring, automatic conflict-of-interest detection & assignment blocking, evaluator calibration metric.
5. **Pilot Control Tower & Milestone Payments**: RAG risk indicators, stage flow (DRAFT → SCALED), simulated milestone tranches.
6. **4-Way Evidence Verification**: Compares Claimed vs Govt Observed Data vs Evaluator Score vs Independent Validator with SHA-256 integrity verification.
7. **Scale Readiness & Replication Engine**: Multi-metric scorecard (92/100 READY FOR SCALE) and data-driven cross-district replication recommendations (Nashik, Nagpur, Thane).
8. **Public Datasets & Machine Learning Pipeline**: 6 distinct ML models trained on public open data (`data.gov.in`, DPIIT, OpenStreetMap, DES Maharashtra) with documented data provenance (`REAL_PUBLIC` vs `SYNTHETIC`).

---

## Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Environment Setup & Data Pipeline
```bash
# Clone repository
git clone https://github.com/maharashtra-gov/mipp-sih2026.gitt
cd "sih full project"

# Setup Python Virtual Environment inside Backend
cd Backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt numpy scikit-learn pandas

# Run Data Download, Ingestion & ML Pipeline
python ..\scripts\download_data.py
python ..\scripts\clean_data.py
python ..\scripts\build_dataset.py
python ..\ml\training\train_all.py
python ..\ml\evaluation\evaluate_models.py
python ..\scripts\seed_demo.py
```

### 2. Start Backend API Server
```bash
cd Backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
# API Docs available at http://localhost:8000/docs
```

### 3. Start Frontend Operating System
```bash
cd frontend
npm install
npm run dev
# Web App running at http://localhost:5173
```

---

## Documentation Registry

- [ARCHITECTURE.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/ARCHITECTURE.md): Multi-layer architecture design.
- [API.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/API.md): FastAPI REST endpoints reference.
- [ML_PIPELINE.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/ML_PIPELINE.md): Data pipeline, feature engineering, and model evaluation metrics.
- [DATA_SOURCES.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/DATA_SOURCES.md): Log of external public open datasets, URLs, and licenses.
- [DATASET.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/DATASET.md): Preprocessing, deduplication, and leakage checks.
- [MODEL_CARD.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/MODEL_CARD.md): Documentation of the 6 trained ML models.
- [SECURITY.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/SECURITY.md): RBAC, JWT, SHA-256 audit logging, CERT-In compliance.
- [DEMO_GUIDE.md](file:///c:/Users/mm428/OneDrive/Desktop/sih%20full%20project/DEMO_GUIDE.md): Step-by-step judge walkthrough for SIH evaluation.
