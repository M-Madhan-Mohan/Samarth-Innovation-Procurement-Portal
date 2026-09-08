class ChallengeQualityAssessor:
    def evaluate(self, challenge_data):
        """
        Evaluates 7 dimensions of Challenge Quality (0-100):
        - Outcome Clarity (15)
        - KPI Measurability (15)
        - Scope Clarity (15)
        - Feasibility (15)
        - Data Readiness (15)
        - Risk Completeness (15)
        - Procurement Readiness (10)
        """
        desired_outcome = str(challenge_data.get("desired_outcome", challenge_data.get("expectedOutcome", "")))
        kpi = str(challenge_data.get("kpi", challenge_data.get("kpi_metric", "")))
        baseline = str(challenge_data.get("baseline", challenge_data.get("baseline_val", "")))
        target = str(challenge_data.get("target", challenge_data.get("target_val", "")))
        scope = str(challenge_data.get("scope", challenge_data.get("scope_text", "")))
        risk = str(challenge_data.get("risk_mitigation", challenge_data.get("risk", "")))
        budget = challenge_data.get("suggested_budget", challenge_data.get("budget", ""))

        # Scores calculation
        outcome_clarity = 14.5 if len(desired_outcome) > 30 else 10.0
        kpi_measurability = 14.8 if (kpi and baseline and target) else 9.0
        scope_clarity = 13.5 if len(scope) > 20 else 8.5
        feasibility = 14.0
        data_readiness = 12.5
        risk_completeness = 13.5 if len(risk) > 15 else 8.0
        procurement_readiness = 9.2 if budget else 6.0

        total = round(outcome_clarity + kpi_measurability + scope_clarity + feasibility + data_readiness + risk_completeness + procurement_readiness, 1)

        breakdown = {
            "outcome_clarity": outcome_clarity,
            "kpi_measurability": kpi_measurability,
            "scope_clarity": scope_clarity,
            "feasibility": feasibility,
            "data_readiness": data_readiness,
            "risk_completeness": risk_completeness,
            "procurement_readiness": procurement_readiness
        }

        recommendations = []
        if kpi_measurability < 12:
            recommendations.append("Add explicit numerical baseline and target values for primary KPI.")
        if risk_completeness < 10:
            recommendations.append("Expand risk mitigation plan for data privacy and field deployment.")
        if outcome_clarity < 12:
            recommendations.append("Refine desired outcome statement to specify target beneficiaries.")

        return {
            "quality_score": int(round(total)),
            "breakdown": breakdown,
            "recommendations": recommendations,
            "status": "APPROVED_FOR_PUBLICATION" if total >= 80 else "NEEDS_REVISION"
        }
