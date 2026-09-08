from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.database import SessionLocal
from app.models.mipp_models import MippChallenge
from app.services.ai_service import AIService
from app.services.ml_service import ml_service

router = APIRouter(prefix="/mipp/challenges", tags=["MIPP Challenges"])
ai_service = AIService()

class PromptRequest(BaseModel):
    prompt: str

class ChallengeCreateSchema(BaseModel):
    id: Optional[str] = None
    title: str
    short_summary: Optional[str] = None
    department: str
    domain: str
    domain_label: Optional[str] = None
    budget: str
    pilot_timeline: Optional[str] = "6 Months"
    deadline: Optional[str] = "2026-10-30"
    status: Optional[str] = "PUBLISHED"
    problem_statement: str
    desired_outcome: Optional[str] = None
    primary_kpi: str
    baseline_value: str
    target_value: str
    suggested_budget: Optional[str] = None
    pilot_duration_months: Optional[int] = 6
    quality_score: Optional[int] = 90
    quality_breakdown: Optional[dict] = None
    brief: Optional[dict] = None

def validate_evaluation_weights(brief: dict):
    criteria = brief.get("evaluation_criteria", []) if brief else []
    if not isinstance(criteria, list) or not criteria:
        return
    weights = [item.get("weight") for item in criteria if isinstance(item, dict)]
    if len(weights) != len(criteria) or any(not isinstance(weight, (int, float)) for weight in weights):
        raise HTTPException(status_code=422, detail="Evaluation criteria must contain numeric weights")
    if round(sum(weights), 2) != 100:
        raise HTTPException(status_code=422, detail="Evaluation criteria weights must total 100%")

@router.post("/generate-copilot")
def generate_challenge_copilot(req: PromptRequest):
    if not req.prompt or len(req.prompt.strip()) < 20:
        raise HTTPException(status_code=400, detail="Please describe the government problem in a little more detail.")
    try:
        result = ai_service.generate_challenge(req.prompt)
        validate_evaluation_weights(result)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        print(f"[MIPP AI] response validation failed: {type(exc).__name__}")
        raise HTTPException(status_code=503, detail="AI service is currently unavailable.") from exc

@router.post("/assess-quality")
def assess_challenge_quality(challenge_data: dict):
    return ml_service.assess_quality(challenge_data)

@router.post("/")
def create_challenge(req: ChallengeCreateSchema):
    db = SessionLocal()
    try:
        validate_evaluation_weights(req.brief or {})
        challenge_id = req.id if req.id else f"CH-2026-MH-{db.query(MippChallenge).count() + 101:03d}"
        
        # Check if exists
        existing = db.query(MippChallenge).filter(MippChallenge.id == challenge_id).first()
        if existing:
            # Update existing
            existing.title = req.title
            existing.problem_statement = req.problem_statement
            existing.status = req.status
            existing.department = req.department
            existing.domain = req.domain
            existing.domain_label = req.domain_label if req.domain_label else req.domain.title()
            existing.budget = req.budget
            existing.pilot_timeline = req.pilot_timeline
            existing.deadline = req.deadline
            existing.desired_outcome = req.desired_outcome
            existing.primary_kpi = req.primary_kpi
            existing.baseline_value = req.baseline_value
            existing.target_value = req.target_value
            existing.pilot_duration_months = req.pilot_duration_months
            existing.quality_score = req.quality_score if req.quality_score else 90
            existing.quality_breakdown = {"breakdown": req.quality_breakdown or {}, "brief": req.brief or {}}
            db.commit()
            return {"status": "UPDATED", "challenge_id": challenge_id}

        new_ch = MippChallenge(
            id=challenge_id,
            title=req.title,
            department=req.department,
            domain=req.domain,
            domain_label=req.domain_label if req.domain_label else req.domain.title(),
            budget=req.budget,
            pilot_timeline=req.pilot_timeline,
            deadline=req.deadline,
            status=req.status,
            applicant_count=0,
            problem_statement=req.problem_statement,
            desired_outcome=req.desired_outcome,
            primary_kpi=req.primary_kpi,
            baseline_value=req.baseline_value,
            target_value=req.target_value,
            pilot_duration_months=req.pilot_duration_months,
            quality_score=req.quality_score if req.quality_score else 90,
            quality_breakdown={"breakdown": req.quality_breakdown or {}, "brief": req.brief or {}}
        )

        db.add(new_ch)
        db.commit()
        return {"status": "CREATED", "challenge_id": challenge_id, "title": req.title}
    finally:
        db.close()

@router.get("/")
def list_challenges():
    db = SessionLocal()
    try:
        db_challenges = db.query(MippChallenge).all()
        if db_challenges and len(db_challenges) > 0:
            return [
                {
                    "id": c.id,
                    "title": c.title,
                    "department": c.department,
                    "domain": c.domain,
                    "domainLabel": c.domain_label if c.domain_label else c.domain.title(),
                    "budget": c.budget,
                    "pilotTimeline": c.pilot_timeline,
                    "deadline": c.deadline,
                    "status": c.status.lower() if c.status else "open",
                    "applicantCount": c.applicant_count,
                    "qualityScore": c.quality_score,
                    "problemStatement": c.problem_statement,
                    "expectedOutcome": c.desired_outcome,
                    "primaryKpi": c.primary_kpi,
                    "baselineValue": c.baseline_value,
                    "targetValue": c.target_value,
                    "brief": (c.quality_breakdown or {}).get("brief", {}) if isinstance(c.quality_breakdown, dict) else {}
                } for c in db_challenges
            ]

        # Seed defaults if DB is empty
        return [
            {
                "id": "CH-2026-PUNE-01",
                "title": "Adaptive AI Signal Control & Traffic Safety in Pune School Zones",
                "department": "Urban Development Department, Maharashtra",
                "domain": "transport",
                "domainLabel": "Transport & Logistics",
                "budget": "₹ 1,20,00,000",
                "pilotTimeline": "6 Months",
                "deadline": "2026-09-30",
                "status": "selected_pilot",
                "applicantCount": 16,
                "qualityScore": 92,
                "problemStatement": "Peak-hour traffic congestion near school corridors in Pune causes up to 18-minute delays and safety risks.",
                "expectedOutcome": "Deploy computer vision edge sensors to dynamically adjust signal timing and reduce bottleneck delays by 25%+."
            },
            {
                "id": "CH-2026-001",
                "title": "AI-Based Crop Disease Early Detection in Cotton & Sugarcane Belt",
                "department": "Department of Agriculture, Maharashtra",
                "domain": "agriculture",
                "domainLabel": "Agriculture & AgriTech",
                "budget": "₹ 50,00,000",
                "pilotTimeline": "6 Months",
                "deadline": "2026-10-15",
                "status": "open",
                "applicantCount": 14,
                "qualityScore": 88,
                "problemStatement": "Crop diseases cause up to 35% yield loss annually in sugarcane and cotton belts.",
                "expectedOutcome": "Deploy mobile AI computer vision model capable of offline leaf scan disease detection with 90%+ accuracy."
            }
        ]
    finally:
        db.close()
