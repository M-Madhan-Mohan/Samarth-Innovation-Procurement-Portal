from fastapi import APIRouter

router = APIRouter(prefix="/mipp/pilots", tags=["MIPP Pilot Control Tower"])

@router.get("/{pilot_id}")
def get_pilot_details(pilot_id: str):
    return {
        "pilot_id": pilot_id,
        "challenge_id": "CH-2026-PUNE-01",
        "challenge_title": "Adaptive AI Signal Control & Traffic Safety in Pune School Zones",
        "department": "Urban Development Department, Maharashtra",
        "district": "Pune",
        "startup_id": "ST-005",
        "startup_name": "UrbanFlow Mobility AI",
        "status": "DEPLOYMENT",
        "rag_status": "GREEN",
        "total_budget": 12000000.0,
        "released_budget": 4800000.0,
        "progress_pct": 65,
        "timeline": "Week 16 of 24 (On Schedule)",
        "milestones": [
            {"id": "M1", "title": "Onboarding & Corridor Survey", "percentage": 20, "amount": 2400000.0, "due_date": "2026-06-30", "status": "APPROVED", "payment_status": "RELEASED", "rag": "GREEN"},
            {"id": "M2", "title": "Edge AI Hardware & Camera Deployment", "percentage": 20, "amount": 2400000.0, "due_date": "2026-07-31", "status": "APPROVED", "payment_status": "RELEASED", "rag": "GREEN"},
            {"id": "M3", "title": "Telemetry & Baseline Data Collection", "percentage": 20, "amount": 2400000.0, "due_date": "2026-08-31", "status": "APPROVED", "payment_status": "PENDING_EVIDENCE", "rag": "GREEN"},
            {"id": "M4", "title": "25%+ KPI Delay Reduction Achievement", "percentage": 25, "amount": 3000000.0, "due_date": "2026-09-30", "status": "PENDING", "payment_status": "NOT_DUE", "rag": "AMBER"},
            {"id": "M5", "title": "Independent Validation & Scale Handover", "percentage": 15, "amount": 1800000.0, "due_date": "2026-10-31", "status": "PENDING", "payment_status": "NOT_DUE", "rag": "GREEN"}
        ],
        "kpi_performance": {
            "metric": "Average peak congestion delay",
            "baseline": "18.0 mins",
            "target": "12.0 mins",
            "current_observed": "11.7 mins (35% reduction)",
            "achievement_pct": 113.0
        }
    }

@router.post("/{pilot_id}/milestones/{milestone_id}/release-payment")
def release_milestone_payment(pilot_id: str, milestone_id: str):
    """
    Simulated PFMS Payment Disbursement Engine
    """
    return {
        "status": "PAYMENT_RELEASED",
        "pilot_id": pilot_id,
        "milestone_id": milestone_id,
        "utr_transaction_id": f"PFMS-SIM-MH-2026-{milestone_id}-88219",
        "amount_released": "₹ 24,00,000",
        "message": f"Simulated milestone disbursement for {milestone_id} released successfully into startup Escrow account."
    }
