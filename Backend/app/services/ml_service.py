import os
import sys
from pathlib import Path

# Ensure root directory is in sys.path for ml imports
root_dir = str(Path(__file__).resolve().parents[3])
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from ml.models.matching_model import StartupMatchingEngine
from ml.models.challenge_quality_model import ChallengeQualityAssessor
from ml.models.pilot_risk_model import PilotRiskModel
from ml.models.evidence_confidence_model import EvidenceConfidenceModel
from ml.models.scale_readiness_model import ScaleReadinessModel
from ml.models.replication_model import ReplicationEngine



class MLService:
    def __init__(self):
        self.matcher = StartupMatchingEngine()
        self.quality = ChallengeQualityAssessor()
        self.risk = PilotRiskModel()
        self.evidence = EvidenceConfidenceModel()
        self.scale = ScaleReadinessModel()
        self.replication = ReplicationEngine()

    def match_startups(self, challenge, startups):
        results = []
        for s in startups:
            res = self.matcher.match_startup(challenge, s)
            res["startup_id"] = s.get("id", s.get("startup_id", "ST-000"))
            res["name"] = s.get("name", "Unknown Startup")
            res["sector"] = s.get("sector", "general")
            results.append(res)
        
        results.sort(key=lambda x: x["overall_score"], reverse=True)
        return results

    def assess_quality(self, challenge_data):
        return self.quality.evaluate(challenge_data)

    def predict_risk(self, pilot_data):
        return self.risk.predict_risk(pilot_data)

    def verify_evidence(self, claim_val, govt_val, eval_val, validator_val):
        return self.evidence.verify_evidence(claim_val, govt_val, eval_val, validator_val)

    def evaluate_scale(self, pilot_performance):
        return self.scale.evaluate_scale(pilot_performance)

    def get_replications(self, pilot_id):
        return self.replication.recommend_replications(pilot_id)

ml_service = MLService()
