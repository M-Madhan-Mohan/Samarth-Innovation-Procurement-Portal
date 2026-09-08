from fastapi import APIRouter
from app.database import SessionLocal
from app.models.mipp_models import MippChallenge, MippStartup
from app.services.ml_service import ml_service

router = APIRouter(prefix="/mipp/matching", tags=["MIPP AI Matching"])

@router.get("/challenge/{challenge_id}")
def match_startups_for_challenge(challenge_id: str):
    db = SessionLocal()
    try:
        ch = db.query(MippChallenge).filter(MippChallenge.id == challenge_id).first()
        if ch:
            challenge_dict = {
                "id": ch.id,
                "title": ch.title,
                "domain": ch.domain,
                "expected_solution_type": ch.expected_solution_type or ch.title
            }
        else:
            challenge_dict = {
                "id": challenge_id,
                "title": "Adaptive AI Signal Control & Traffic Safety in Pune School Zones",
                "domain": "transport",
                "expected_solution_type": "Computer vision traffic signal optimization"
            }

        db_startups = db.query(MippStartup).all()
        if db_startups and len(db_startups) > 0:
            startups = [
                {
                    "id": s.id,
                    "name": s.name,
                    "sector": s.sector,
                    "technology": s.summary,
                    "tech_stack": s.summary,
                    "location": s.location,
                    "past_pilots_count": s.past_pilots_count,
                    "security_cert": "CERT-In Safe-to-Host",
                    "team_size": s.team_size
                } for s in db_startups
            ]
        else:
            startups = [
                {"id": "ST-005", "name": "UrbanFlow Mobility AI", "sector": "transport", "technology": "Computer Vision, Edge AI, OpenCV, ROS", "tech_stack": "Computer Vision, Edge AI, OpenCV, ROS", "location": "Pune, Maharashtra", "past_pilots_count": 5, "security_cert": "CERT-In Safe-to-Host", "team_size": 22},
                {"id": "ST-001", "name": "AgriVision Technologies Pvt Ltd", "sector": "agriculture", "technology": "Crop Disease Detection, PyTorch", "tech_stack": "Crop Disease Detection, PyTorch", "location": "Pune, Maharashtra", "past_pilots_count": 4, "security_cert": "ISO 9001", "team_size": 18},
                {"id": "ST-002", "name": "JalSuraksha IoT Solutions", "sector": "environment", "technology": "Solar IoT Sensors, LoRaWAN", "tech_stack": "Solar IoT Sensors, LoRaWAN", "location": "Nashik, Maharashtra", "past_pilots_count": 2, "security_cert": "CPCB Lab Certified", "team_size": 12},
                {"id": "ST-003", "name": "VaniAI GovTech Labs", "sector": "governance", "technology": "IndicBERT Vernacular LLM", "tech_stack": "IndicBERT Vernacular LLM", "location": "Mumbai, Maharashtra", "past_pilots_count": 3, "security_cert": "MeitY Empanelled", "team_size": 8},
                {"id": "ST-004", "name": "HealthPoint Diagnostics India", "sector": "healthcare", "technology": "Microfluidic Point-of-Care Cartridges", "tech_stack": "Microfluidic Point-of-Care Cartridges", "location": "Nagpur, Maharashtra", "past_pilots_count": 6, "security_cert": "CDSCO Approved", "team_size": 34}
            ]

        matches = ml_service.match_startups(challenge_dict, startups)
        return {
            "challenge_id": challenge_id,
            "challenge_title": challenge_dict["title"],
            "total_startups_evaluated": len(startups),
            "matches": matches
        }
    finally:
        db.close()
