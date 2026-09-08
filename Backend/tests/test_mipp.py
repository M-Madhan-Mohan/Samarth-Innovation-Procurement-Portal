import sys
import os
from pathlib import Path

# Add project root to sys.path
root_dir = str(Path(__file__).resolve().parents[2])
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

backend_dir = os.path.join(root_dir, "Backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.services.ai_service import AIService
from app.services.ml_service import ml_service
from ml.models.matching_model import StartupMatchingEngine
from ml.models.evidence_confidence_model import EvidenceConfidenceModel
from ml.models.scale_readiness_model import ScaleReadinessModel
from ml.models.replication_model import ReplicationEngine

def test_ai_copilot_generation():
    ai = AIService()
    prompt = "Traffic congestion near schools in Pune is causing delays and safety problems."
    res = ai.generate_challenge(prompt)
    assert "title" in res
    assert res["quality_score"] >= 80
    assert "primary_kpi" in res

def test_matching_engine():
    matcher = StartupMatchingEngine()
    challenge = {"domain": "transport", "title": "Traffic signal control", "expected_solution_type": "Computer vision"}
    startup = {"sector": "transport", "technology": "Computer vision, Edge AI", "tech_stack": "Computer vision, Edge AI", "location": "Pune, Maharashtra", "security_cert": "CERT-In Safe-to-Host", "past_pilots_count": 5, "team_size": 22}
    res = matcher.match_startup(challenge, startup)
    assert res["overall_score"] >= 80
    assert "breakdown" in res


def test_evidence_verification():
    evid = EvidenceConfidenceModel()
    res = evid.verify_evidence(35.0, 29.0, 31.0, 28.0)
    assert res["confidence"] == "HIGH"
    assert res["status"] in ["VERIFIED", "PARTIALLY_VERIFIED"]

def test_scale_readiness():
    scale = ScaleReadinessModel()
    pilot = {"kpi_achievement_pct": 113.0, "budget_variance_pct": 2.0, "security_pass": True, "independent_validation_pass": True}
    res = scale.evaluate_scale(pilot)
    assert res["scale_readiness_score"] >= 85
    assert res["decision"] == "READY_FOR_SCALE"

def test_replication_engine():
    repl = ReplicationEngine()
    recs = repl.recommend_replications()
    assert len(recs) >= 3
    assert recs[0]["district"] in ["Nashik", "Thane", "Nagpur"]
