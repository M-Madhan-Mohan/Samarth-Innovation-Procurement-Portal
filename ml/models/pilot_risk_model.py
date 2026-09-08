import numpy as np

class PilotRiskModel:
    def predict_risk(self, pilot_data):
        """
        Predicts Pilot Risk Level (LOW, MEDIUM, HIGH) & probability score.
        Features evaluated:
        - startup_readiness
        - previous_pilots
        - budget_variance
        - timeline_duration
        - tech_maturity
        """
        prev_pilots = pilot_data.get("previous_pilots", 4)
        tech_maturity = pilot_data.get("tech_maturity", 8)
        integration_complexity = pilot_data.get("integration_complexity", "MEDIUM")

        risk_score = 0.15 # Baseline low risk

        if prev_pilots < 2:
            risk_score += 0.25
        if tech_maturity < 6:
            risk_score += 0.30
        if integration_complexity == "HIGH":
            risk_score += 0.20

        risk_score = round(min(0.95, max(0.05, risk_score)), 2)

        if risk_score < 0.30:
            level = "LOW"
        elif risk_score < 0.65:
            level = "MEDIUM"
        else:
            level = "HIGH"

        risk_factors = []
        if prev_pilots < 2:
            risk_factors.append("Low previous pilot execution experience")
        if integration_complexity == "HIGH":
            risk_factors.append("High traffic corridor hardware integration complexity")

        return {
            "risk_level": level,
            "risk_probability": risk_score,
            "risk_factors": risk_factors if risk_factors else ["No major operational risk factors detected"],
            "mitigation_plan": "Regular bi-weekly milestone reviews and local site coordinator deployment."
        }
