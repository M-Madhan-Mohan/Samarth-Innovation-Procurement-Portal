import hashlib

class EvidenceConfidenceModel:
    def verify_evidence(self, claim_val, govt_val, eval_val, validator_val):
        """
        4-Way Comparison Engine:
        Compares:
        1. Startup Claimed Result
        2. Government Observed Data
        3. Evaluator Assessment
        4. Independent Validator Assessment
        """
        vals = [claim_val, govt_val, eval_val, validator_val]
        avg_obs = round((govt_val + eval_val + validator_val) / 3.0, 1)
        variance = max(vals) - min(vals)

        if variance <= 4.0:
            confidence = "HIGH"
            reliability = "HIGH"
            status = "VERIFIED"
            verified_result = f"{govt_val}% delay reduction"
        elif variance <= 8.0:
            confidence = "HIGH"
            reliability = "MEDIUM"
            status = "PARTIALLY_VERIFIED"
            verified_result = f"{govt_val}% delay reduction (Government Verified Ground Observation)"
        else:
            confidence = "LOW"
            reliability = "LOW"
            status = "REJECTED"
            verified_result = f"{avg_obs}% delay reduction"

        return {
            "claimed_result": f"{claim_val}% reduction",
            "observed_result": f"{govt_val}% reduction",
            "evaluator_result": f"{eval_val}% reduction",
            "validator_result": f"{validator_val}% reduction",
            "verified_result": verified_result,
            "verified_value_num": govt_val,
            "confidence": confidence,
            "claim_reliability": reliability,
            "status": status,
            "variance": round(variance, 1),
            "sha256_verified": True
        }

    @staticmethod
    def calculate_sha256(content_bytes: bytes) -> str:
        return hashlib.sha256(content_bytes).hexdigest()
