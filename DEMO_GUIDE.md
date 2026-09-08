# MIPP Judge Demo Guide — SIH 2026 Walkthrough (`DEMO_GUIDE.md`)

This guide provides the exact 13-step demonstration sequence for judges evaluating the **MIPP (Maharashtra Innovation Procurement Passport)** prototype for **SIH Problem Statement 26136**.

---

## Interactive Judge Demo Controller

The web application features a sticky top banner **"SIH 2026 Judge Demo"** with buttons for Steps 1 through 13. Clicking any step automatically loads the relevant role and page.

---

## Step-by-Step Demonstration Flow

| Step | Title | Target Page / Action | Key Features to Highlight |
|---|---|---|---|
| **1** | **Enter Problem** | `/government/create-challenge` | Government officer inputs: *"Traffic congestion near schools in Pune is causing delays and safety risks."* |
| **2** | **AI Copilot Draft** | `/government/create-challenge` | AI Copilot generates 23 outcome-based fields (Problem, Outcome, KPI, Baseline 18min, Target 12min, Scope, Eligibility, Risk, Milestones). |
| **3** | **Quality Score 92/100** | `/government/create-challenge` | Shows Challenge Quality Score breakdown across 7 dimensions (Outcome Clarity, Measurability, Scope, Feasibility, Data, Risk, Procurement). |
| **4** | **AI Startup Match** | `/government/startups` | Matching Engine ranks eligible startups: **UrbanFlow Mobility AI — 91%**. |
| **5** | **Explain Match Score** | `/government/startups` | Displays 7-dimension score breakdown (Tech 27/30, Domain 19/20, Readiness 14/15, Cost 9/10, Geo 8/10, Security 9/10, Team 5/5) and Strengths/Weaknesses. |
| **6** | **Capability Passport** | `/startup/profile` | Inspects Startup Capability Passport & Verified Pilot Passport record. |
| **7** | **Blind Evaluation** | `/evaluator/evaluate/APP-2026-103` | Independent evaluator scores proposal in Blind Mode with startup identity redacted. |
| **8** | **Conflict Auto-Blocked** | `/evaluator/dashboard` | Evaluator clicks "Conflict Detected" → System automatically blocks assignment and reassigns to alternate expert with audit record. |
| **9** | **Pilot Awarded** | `/government/control-tower` | Winning startup enters Pilot Control Tower in Pune school zone corridor. |
| **10** | **Control Tower & Tranches** | `/government/control-tower` | Real-time RAG indicators (GREEN), timeline, and simulated PFMS milestone payment disbursement. |
| **11** | **4-Way Evidence Verification** | `/government/evidence-verification` | 4-Way comparison table: Startup Claim (35%) vs Govt Observed (29%) vs Evaluator (31%) vs Independent Validator (28%). SHA-256 integrity checksum verified. |
| **12** | **Scale Readiness 92/100** | `/government/scale-replication` | Scale Readiness Predictor outputs **READY FOR SCALE** decision with multi-factor scorecard. |
| **13** | **Cross-District Replication** | `/government/scale-replication` | Replication Engine recommends scaling Pune pilot to **Nashik (91%)**, **Nagpur (87%)**, **Thane (94%)** based on data similarity. |

---

## Verification & Launch Commands

1. **Backend**: `cd Backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --port 8000`
2. **Frontend**: `cd frontend && npm run dev`
3. Open `http://localhost:5173` in browser and click **Step 1** on the Judge Demo bar.
