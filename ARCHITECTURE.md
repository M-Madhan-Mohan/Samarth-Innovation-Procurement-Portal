# MIPP Architecture Specification (`ARCHITECTURE.md`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MIPP FRONTEND OPERATING SYSTEM                     │
│    React + Vite + Tailwind/Glassmorphic System + Motion Animation       │
│                                                                         │
│ ┌────────────────┐ ┌──────────────────┐ ┌─────────────────────────────┐ │
│ │Challenge Copilot│ │Capability Passport│ │Pilot Control Tower Dashboard│ │
│ └────────────────┘ └──────────────────┘ └─────────────────────────────┘ │
│ ┌────────────────┐ ┌──────────────────┐ ┌─────────────────────────────┐ │
│ │Blind Evaluation│ │Evidence Verifier │ │Scale & Replication Engine   │ │
│ └────────────────┘ └──────────────────┘ └─────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                STEPS 1–13 JUDGE DEMO BAR (Top Sticky Controller)     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST JSON APIs (/api/v1)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      MIPP FASTAPI BACKEND SERVICES                      │
│                                                                         │
│ ┌────────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐ │
│ │ Challenges Router  │ │ Startups Router  │ │ Matching Router         │ │
│ └────────────────────┘ └──────────────────┘ └─────────────────────────┘ │
│ ┌────────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐ │
│ │ Evaluations Router │ │ Pilots Router    │ │ Evidence Router         │ │
│ └────────────────────┘ └──────────────────┘ └─────────────────────────┘ │
│ ┌────────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐ │
│ │ Scale/Replication  │ │ ML Transparency  │ │ Audit Logger (SHA-256)  │ │
│ └────────────────────┘ └──────────────────┘ └─────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ ORM / Engine
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        RELATIONAL DATABASE LAYER                        │
│         SQLite / PostgreSQL (`post_award.db` with SQLAlchemy)           │
│ MippUser, MippChallenge, MippStartup, MippPilot, MippMilestone, Evidence│
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Trained Artifacts (.pkl / .json)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXPLAINABLE MACHINE LEARNING SUITE                   │
│                                                                         │
│ 1. Matching Engine (7D TF-IDF + Weighted Scoring)                       │
│ 2. Challenge Quality Assessor (7-Dimension Quality Rubric)              │
│ 3. Pilot Risk Classifier (Random Forest Probability)                    │
│ 4. Evidence Confidence Model (4-Way Variance & SHA-256 Validation)       │
│ 5. Scale Readiness Predictor (Random Forest Classifier: 92/100 READY)   │
│ 6. Cross-District Replication Engine (KNN Demographic/Corridor Similarity)│
└─────────────────────────────────────────────────────────────────────────┘
```
