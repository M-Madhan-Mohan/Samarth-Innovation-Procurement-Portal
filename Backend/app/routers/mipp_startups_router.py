from fastapi import APIRouter

router = APIRouter(prefix="/mipp/startups", tags=["MIPP Startups & Passport"])

@router.get("/{startup_id}/passport")
def get_startup_passport(startup_id: str):
    """
    Returns Startup Capability Passport & Verified Pilot Passport
    """
    return {
        "startup_id": startup_id,
        "name": "UrbanFlow Mobility AI",
        "dpiit_number": "DPIIT94821",
        "founded_year": 2022,
        "location": "Pune, Maharashtra",
        "founder": "Dr. Rajesh Deshmukh & Team",
        "sector": "Transport & Logistics",
        "stage": "Growth Stage",
        "team_size": 22,
        "summary": "Building edge AI traffic signal optimization and computer vision telemetry for municipal Smart Cities.",
        "scores": {
            "technical_readiness": 92,
            "government_readiness": 90,
            "pilot_readiness": 94,
            "security_readiness": 95,
            "deployment_readiness": 88,
            "operational_readiness": 89
        },
        "certifications": ["CERT-In Safe-to-Host", "ISO 27001:2022", "DPIIT Recognised", "MeitY Empanelled"],
        "verified_pilot_passport": {
            "pilot_id": "PL-2026-PUNE-01",
            "challenge": "Adaptive AI Signal Control & Traffic Safety in Pune School Zones",
            "department": "Urban Development Department, Maharashtra",
            "district": "Pune",
            "duration": "6 Months",
            "kpi_achievement": "113% (35% delay reduction vs 25% target)",
            "timeline": "On Time",
            "budget_variance": "+2%",
            "security": "Passed CERT-In Audit",
            "independent_validation": "Passed (College of Engineering Pune - COEP)",
            "recommendation": "READY FOR SCALE"
        }
    }

@router.get("/demand-radar")
def get_demand_radar():
    """
    Statewide demand radar for startups
    """
    return [
        {"sector": "Urban Mobility & Traffic", "open_challenges": 12, "urgency": "High", "budget_range": "₹50L - ₹1.5Cr", "districts": ["Pune", "Thane", "Nagpur"]},
        {"sector": "Agriculture & AgriTech", "open_challenges": 18, "urgency": "High", "budget_range": "₹30L - ₹80L", "districts": ["Yavatmal", "Nanded", "Kolhapur"]},
        {"sector": "GovTech & Vernacular NLP", "open_challenges": 15, "urgency": "Medium", "budget_range": "₹25L - ₹60L", "districts": ["Statewide"]},
        {"sector": "Healthcare & Diagnostics", "open_challenges": 9, "urgency": "High", "budget_range": "₹40L - ₹1.0Cr", "districts": ["Gadchiroli", "Nandurbar"]}
    ]
