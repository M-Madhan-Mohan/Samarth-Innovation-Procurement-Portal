from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/mipp/evaluations", tags=["MIPP Expert Evaluation"])

class ConflictCheckRequest(BaseModel):
    evaluator_id: str
    application_id: str
    has_conflict: bool
    reason: Optional[str] = None

class EvaluationSubmitRequest(BaseModel):
    application_id: str
    evaluator_id: str
    tech_score: float
    social_impact_score: float
    innovation_score: float
    security_score: float
    cost_score: float
    scalability_score: float
    comments: str

@router.post("/conflict-check")
def declare_conflict(req: ConflictCheckRequest):
    if req.has_conflict:
        return {
            "status": "ASSIGNMENT_BLOCKED",
            "action": "AUTOMATICALLY_REASSIGNED",
            "audit_record": f"AUDIT-CONF-{req.evaluator_id}-{req.application_id}",
            "message": f"Conflict declared by evaluator {req.evaluator_id}. Application {req.application_id} has been blocked and automatically reassigned to an independent alternate expert."
        }
    return {
        "status": "APPROVED_TO_EVALUATE",
        "message": "No conflict declared. Proceed with blind proposal scoring."
    }

@router.get("/calibration/{evaluator_id}")
def get_evaluator_calibration(evaluator_id: str):
    return {
        "evaluator_id": evaluator_id,
        "name": "Dr. S. K. Mahajan",
        "calibration_score": 94.2,
        "historical_mean_score": 86.4,
        "deviation_from_peers": "+1.8%",
        "consistency_indicator": "HIGHLY_CALIBRATED",
        "proposals_evaluated": 18
    }
