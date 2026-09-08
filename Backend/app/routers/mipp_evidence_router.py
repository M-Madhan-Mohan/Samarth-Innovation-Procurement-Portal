from fastapi import APIRouter
from app.services.ml_service import ml_service

router = APIRouter(prefix="/mipp/evidence", tags=["MIPP Evidence Verification"])

@router.get("/pilot/{pilot_id}")
def get_evidence_verification(pilot_id: str):
    """
    4-Way Side-by-Side Comparison Engine
    """
    res = ml_service.verify_evidence(
        claim_val=35.0,
        govt_val=29.0,
        eval_val=31.0,
        validator_val=28.0
    )

    return {
        "pilot_id": pilot_id,
        "evidence_file": "pune_school_zone_traffic_telemetry_aug2026.csv",
        "sha256_checksum": "a8f3b29c910e14d5e89a0b12c34d56e789f0123456789abcdef0123456789abc",
        "uploaded_by": "UrbanFlow Mobility AI (Startup)",
        "timestamp": "2026-08-28 14:32:00 IST",
        "file_size": "14.2 MB",
        "verification": res,
        "comparison_matrix": [
            {"source": "1. Startup Claimed Result", "value": "35.0% reduction", "type": "Self-Reported", "trust_weight": "Baseline"},
            {"source": "2. Government Observed Data", "value": "29.0% reduction", "type": "Municipal IoT Telemetry", "trust_weight": "Primary Ground Truth"},
            {"source": "3. Domain Evaluator Score", "value": "31.0% reduction", "type": "Expert Audit", "trust_weight": "Secondary Review"},
            {"source": "4. Independent Validator (COEP)", "value": "28.0% reduction", "type": "Academic Audit", "trust_weight": "Statutory Validation"}
        ]
    }
