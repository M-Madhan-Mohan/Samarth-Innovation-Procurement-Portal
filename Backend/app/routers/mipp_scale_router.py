from fastapi import APIRouter
from app.services.ml_service import ml_service

router = APIRouter(prefix="/mipp/scale", tags=["MIPP Scale Readiness & Replication"])

@router.get("/assessment/{pilot_id}")
def get_scale_assessment(pilot_id: str):
    pilot_perf = {
        "kpi_achievement_pct": 113.0,
        "budget_variance_pct": 2.0,
        "security_pass": True,
        "independent_validation_pass": True
    }

    scale_res = ml_service.evaluate_scale(pilot_perf)
    replications = ml_service.get_replications(pilot_id)

    return {
        "pilot_id": pilot_id,
        "challenge_title": "Adaptive AI Signal Control & Traffic Safety in Pune School Zones",
        "startup_name": "UrbanFlow Mobility AI",
        "scale_assessment": scale_res,
        "replication_recommendations": replications
    }
