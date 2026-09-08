import os
import sys
import re
import json
import httpx
from pathlib import Path

# Ensure root directory is in sys.path for ml imports
root_dir = str(Path(__file__).resolve().parents[3])
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from ml.models.challenge_quality_model import ChallengeQualityAssessor

class AIService:
    def __init__(self):
        self.api_key = os.environ.get("AI_API_KEY", os.environ.get("OPENAI_API_KEY", os.environ.get("GEMINI_API_KEY", None)))
        self.quality_assessor = ChallengeQualityAssessor()

    def generate_challenge(self, prompt: str) -> dict:
        """
        Dynamic AI Challenge Copilot Architecture:
        Converts ANY government operational problem description into:
        1. SHORT SUMMARY (Procurement title & tagline)
        2. FULL PROCUREMENT-READY CHALLENGE BRIEF (23 outcome-based fields)
        3. CHALLENGE QUALITY SCORECARD (0-100 across 7 dimensions)
        """
        if not prompt or len(prompt.strip()) < 20:
            raise ValueError("Please describe the government problem in a little more detail.")

        # If external API Key exists, try calling LLM Provider
        if self.api_key:
            try:
                llm_result = self._call_llm_provider(prompt)
                if llm_result:
                    normalized = self._normalize_challenge(llm_result, prompt)
                    quality_res = self.quality_assessor.evaluate(normalized)
                    normalized["quality_score"] = quality_res["quality_score"]
                    normalized["quality_breakdown"] = quality_res["breakdown"]
                    return normalized
            except Exception as e:
                print(f"[*] External LLM API call failed, switching to dynamic entity parsing fallback: {e}")

        # Dynamic Entity & Domain Parsing Engine (Deterministic Fallback for ANY prompt)
        return self._generate_dynamic_structured_challenge(prompt)

    def _call_llm_provider(self, prompt: str) -> dict:
        """Invokes external LLM API if configured."""
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an expert Government Procurement AI Officer for the Government of Maharashtra. "
                        "Convert raw operational problems into a JSON object containing short_summary, title, department, "
                        "domain, domain_label, problem_statement, current_situation, desired_outcome, target_beneficiaries, "
                        "scope, out_of_scope, expected_solution_type, primary_kpi, baseline_value, target_value, "
                        "kpi_explanation, pilot_duration_months, suggested_budget, eligibility_criteria, evaluation_criteria, "
                        "data_requirements, cybersecurity_requirements, ip_requirements, risk_classification, risk_mitigation, "
                        "evidence_requirements, pilot_milestones, success_criteria, scale_criteria."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }

        with httpx.Client(timeout=10.0) as client:
            resp = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            if resp.status_code == 200:
                content = resp.json()["choices"][0]["message"]["content"]
                return json.loads(content)
        return None

    def _generate_dynamic_structured_challenge(self, prompt: str) -> dict:
        """
        Dynamic Natural Language Entity & Intent Parsing Engine.
        Extracts entities, locations, action verbs, and generates tailored procurement fields for ANY input.
        """
        text = prompt.strip()
        text_lower = text.lower()

        # 1. Location Detection
        locations = ["Nashik", "Pune", "Mumbai", "Nagpur", "Thane", "Navi Mumbai", "Chhatrapati Sambhajinagar", "Kolhapur", "Solapur", "Amravati", "Nanded", "Yavatmal", "Gadchiroli"]
        detected_location = "Maharashtra"
        for loc in locations:
            if loc.lower() in text_lower:
                detected_location = loc
                break

        # 2. Domain & Department Classification
        if any(w in text_lower for w in ["garbage", "waste", "bin", "trash", "collection", "sanitation", "clean"]):
            domain = "urban_services"
            domain_label = "Urban Services / Waste Management"
            dept = f"Municipal Corporation of {detected_location}, Maharashtra"
            kpis = [
                {"name": "Route adherence", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 90%", "measurement_method": "Compare GPS traces with scheduled routes", "evidence_source": "Municipal fleet GPS logs"},
                {"name": "Collection coverage", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 95%", "measurement_method": "Completed collection points / scheduled points", "evidence_source": "Collection timestamps and route logs"},
                {"name": "Missed collection points", "unit": "count/week", "baseline": "AI-suggested: to be validated", "target": "<= 5% of scheduled points", "measurement_method": "Reconcile schedules with completed scans", "evidence_source": "Collection event records"},
                {"name": "Fuel consumption per route", "unit": "litres/route", "baseline": "AI-suggested: to be validated", "target": "10% reduction", "measurement_method": "Fuel records normalized by route distance", "evidence_source": "Fleet fuel records and GPS distance"},
                {"name": "Citizen complaints", "unit": "complaints/week", "baseline": "AI-suggested: to be validated", "target": "20% reduction", "measurement_method": "Count complaints tagged to collection service", "evidence_source": "Citizen grievance system"}
            ]
            budget = "₹ 65,00,000"
            solution_type = "AI route optimization and municipal fleet performance dashboard"
            beneficiaries = [f"Citizens in {detected_location}", "Municipal sanitation workers", "Municipal operations officers"]
            kpi_exp = "Optimize collection routes using fleet locations, historical patterns and operational data."
        elif any(w in text_lower for w in ["medicine", "stock-out", "stockout", "phc", "health centre", "health center", "shortage"]):
            domain = "healthcare"
            domain_label = "Healthcare"
            dept = "Public Health Department, Maharashtra"
            kpis = [
                {"name": "Medicine stock-out rate", "unit": "%", "baseline": "AI-suggested: to be validated", "target": "<= 5%", "measurement_method": "Centres with zero stock / reporting centres", "evidence_source": "Pharmacy inventory records"},
                {"name": "Forecast accuracy", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 80%", "measurement_method": "Compare predicted and actual monthly demand", "evidence_source": "Inventory and dispensing history"},
                {"name": "Medicine availability", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 95%", "measurement_method": "Essential medicines available at review time", "evidence_source": "PHC stock audits"},
                {"name": "Redistribution time", "unit": "hours", "baseline": "AI-suggested: to be validated", "target": "<= 48 hours", "measurement_method": "Request-to-receipt timestamp", "evidence_source": "Transfer records"}
            ]
            budget = "₹ 60,00,000"
            solution_type = "Medicine demand forecasting and inventory redistribution optimization"
            beneficiaries = ["Rural patients", "Primary health centre staff", "District health officers"]
            kpi_exp = "Predict demand and coordinate redistribution before essential medicines run out."
        elif any(w in text_lower for w in ["crop", "farm", "pest", "disease", "cotton", "sugarcane", "soil", "agriculture"]):
            domain = "agriculture"
            domain_label = "Agriculture / Crop Health"
            dept = "Department of Agriculture, Maharashtra"
            kpis = [
                {"name": "Disease detection accuracy", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 85%", "measurement_method": "Compare model output with agronomist labels", "evidence_source": "Annotated mobile images"},
                {"name": "Time to recommendation", "unit": "minutes", "baseline": "AI-suggested: to be validated", "target": "<= 5 minutes", "measurement_method": "Image upload to localized advice timestamp", "evidence_source": "Application logs"},
                {"name": "Farmer adoption", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 70% of enrolled farmers", "measurement_method": "Active users submitting valid scans", "evidence_source": "Pilot user analytics"}
            ]
            budget = "₹ 50,00,000"
            solution_type = "Mobile computer vision crop disease detection with local-language recommendations"
            beneficiaries = ["Smallholder farmers", "Agricultural extension officers", "District agriculture authorities"]
            kpi_exp = "Detect crop disease early from mobile images and provide actionable local-language advice."
        elif any(w in text_lower for w in ["traffic", "vehicle", "bus", "signal", "road", "congestion", "speed"]):
            domain = "transport"
            domain_label = "Transport & Logistics"
            dept = f"Urban Development Department / Traffic Police, {detected_location}"
            kpis = [{"name": "Peak corridor delay", "unit": "minutes", "baseline": "AI-suggested: to be validated", "target": "20% reduction", "measurement_method": "Travel-time comparison by time window", "evidence_source": "Traffic sensors and GPS traces"}]
            baseline = "18.0 minutes peak delay per corridor"
            target = "12.0 minutes peak delay or lower"
            budget = "₹ 1,20,00,000"
            solution_type = "Computer vision edge cameras integrated with adaptive traffic signal timing controllers"
            beneficiaries = [f"Commuters in {detected_location}", "School children", "Traffic management authorities"]
            kpi_exp = "Dynamic signal timing directly alleviates arterial bottlenecks and reduces vehicle emissions."
        elif any(w in text_lower for w in ["crop", "farm", "pest", "disease", "cotton", "sugarcane", "soil", "agriculture"]):
            domain = "agriculture"
            domain_label = "Agriculture & AgriTech"
            dept = "Department of Agriculture, Maharashtra"
            kpis = [{"name": "Disease detection accuracy", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 90%", "measurement_method": "Compare predictions with expert labels", "evidence_source": "Annotated crop images"}]
            baseline = "55% delayed manual field inspection"
            target = "90%+ offline leaf scan accuracy within 2 minutes"
            budget = "₹ 50,00,000"
            solution_type = "Offline-first mobile computer vision leaf scan application with regional remedies in Marathi"
            beneficiaries = ["Smallholder farmers", "Agricultural extension officers"]
            kpi_exp = "Early pest identification prevents up to 35% crop loss in regional farming belts."
        elif any(w in text_lower for w in ["health", "hospital", "patient", "phc", "diagnostic", "blood", "doctor"]):
            domain = "healthcare"
            domain_label = "Healthcare & Biotech"
            dept = "Public Health Department, Maharashtra"
            kpis = [{"name": "Diagnostic turnaround time", "unit": "hours", "baseline": "AI-suggested: to be validated", "target": "<= 10 minutes", "measurement_method": "Sample receipt to result timestamp", "evidence_source": "PHC diagnostic logs"}]
            baseline = "48 hours sample dispatch delay"
            target = "Sub-10 minutes point-of-care diagnosis"
            budget = "₹ 90,00,000"
            solution_type = "Handheld battery-operated microfluidic diagnostic cartridge units"
            beneficiaries = ["Rural patients", "Primary healthcare centre staff"]
            kpi_exp = "Rapid point-of-care blood diagnostics eliminate sample transport delays in primary healthcare clinics."
        elif any(w in text_lower for w in ["water", "river", "purity", "buoy", "pollution", "drain", "waterbody"]):
            domain = "environment"
            domain_label = "Environment & Cleantech"
            dept = "Water Resources Department, Maharashtra"
            kpis = [{"name": "Water quality telemetry uptime", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 98%", "measurement_method": "Available telemetry intervals / expected intervals", "evidence_source": "Sensor platform logs"}]
            baseline = "40% periodic manual sampling frequency"
            target = "98% continuous real-time IoT monitoring uptime"
            budget = "₹ 75,00,000"
            solution_type = "Solar-powered IoT sensor buoys measuring pH, turbidity, and dissolved oxygen"
            beneficiaries = ["Local communities", "Water utilities", "Environmental authorities"]
            kpi_exp = "Continuous water purity telemetry detects sudden industrial discharge bursts instantly."
        else:
            domain = "governance"
            domain_label = "Governance & GovTech"
            dept = "Department of Information Technology, Maharashtra"
            kpis = [{"name": "Triage classification accuracy", "unit": "%", "baseline": "AI-suggested: to be validated", "target": ">= 90%", "measurement_method": "Compare classifications with reviewed labels", "evidence_source": "Grievance workflow logs"}]
            baseline = "14 days manual ticket sorting latency"
            target = "Sub-minute automated routing with 95%+ precision"
            budget = "₹ 45,00,000"
            solution_type = "Vernacular IndicBERT LLM text classification engine integrated into government portal"
            beneficiaries = [f"Citizens of {detected_location}", "Government service officers"]
            kpi_exp = "Automated classification eliminates administrative backlogs and accelerates citizen service delivery."

        primary_kpi = kpis[0]
        title = f"{solution_type.split(' with ')[0].replace('AI ', 'AI-Based ')} for {detected_location}"
        short_summary = f"{solution_type} for {detected_location} to improve {primary_kpi['name'].lower()} and deliver measurable pilot outcomes."

        challenge_data = {
            "title": title,
            "short_summary": short_summary,
            "department": dept,
            "domain": domain,
            "domain_label": domain_label,
            "problem_statement": text,
            "current_situation": f"Current manual or un-optimized operations in {detected_location} result in frequent service bottlenecks, high operational costs, and administrative delays.",
            "desired_outcome": f"Deploy a high-reliability automated solution in {detected_location} delivering measurable KPI improvements within a 6-month pilot deployment.",
            "target_beneficiaries": beneficiaries,
            "pain_points": ["Operational delays", "Limited visibility for officers", "Inconsistent service outcomes"],
            "desired_outcomes": [f"Improve {item['name'].lower()} against a validated baseline" for item in kpis],
            "scope": f"Phase 1 pilot deployment across major administrative zones in {detected_location} over a 6-month timeline.",
            "out_of_scope": "Full statewide infrastructure replacement prior to formal independent pilot validation.",
            "expected_solution_type": solution_type,
            "expected_solution_category": solution_type,
            "key_performance_indicators": kpis,
            "baseline_metrics": [item["baseline"] for item in kpis],
            "target_metrics": [item["target"] for item in kpis],
            "primary_kpi": primary_kpi["name"],
            "baseline_value": primary_kpi["baseline"],
            "target_value": primary_kpi["target"],
            "kpi_explanation": kpi_exp,
            "pilot_duration_months": 6,
            "suggested_budget": budget,
            "eligibility_criteria": ["DPIIT-recognized or eligible startup", "Working prototype relevant to the challenge", "Pilot deployment and support capability", "Data protection and security readiness"],
            "evaluation_criteria": [{"criterion": "Technical feasibility", "weight": 25}, {"criterion": "Public impact", "weight": 20}, {"criterion": "Innovation", "weight": 15}, {"criterion": "Security and compliance", "weight": 10}, {"criterion": "Cost effectiveness", "weight": 10}, {"criterion": "Scalability", "weight": 20}],
            "data_requirements": [{"name": "Historical operational records", "classification": "Internal", "availability": "To be confirmed by department"}, {"name": "Location or transaction telemetry", "classification": "Sensitive", "availability": "To be confirmed by department"}],
            "cybersecurity_requirements": ["Role-based access control", "Encryption in transit and at rest", "Audit logging", "Secure API deployment", "Data retention and deletion policy"],
            "ip_policy": "Startup retains background IP; department receives a perpetual, royalty-free government-use licence for pilot deliverables.",
            "data_policy": "Department owns government data; startup may process it only for the pilot and must return or delete it at closure.",
            "risk_classification": "MEDIUM",
            "risk_mitigation": [{"risk": "Data quality or availability", "severity": "Medium", "mitigation": "Validate a representative sample and use a monitored pilot data pipeline."}, {"risk": "User adoption", "severity": "Medium", "mitigation": "Train operators and review adoption weekly."}, {"risk": "Privacy or security incident", "severity": "High", "mitigation": "Least-privilege access, encryption, audit logs and incident response plan."}],
            "evidence_requirements": ["System telemetry and audit logs", "Baseline and endline KPI report", "Independent validation report", "User adoption records"],
            "pilot_milestones": ["M1 - Data and stakeholder onboarding", "M2 - Integration and deployment", "M3 - Live operation", "M4 - KPI measurement", "M5 - Independent validation", "M6 - Scale recommendation"],
            "payment_milestones": ["20% on onboarding acceptance", "30% on deployment acceptance", "30% after live KPI measurement", "20% after validation and final report"],
            "success_criteria": [f"Meet the target for {item['name']}" for item in kpis] + ["No unresolved critical security finding"],
            "scale_criteria": ["Meet at least 80% of KPI targets", "Independent validation passed", "Unit economics and operational support plan approved"],
            "independent_validation": "An independent validator will review baseline, evidence quality, KPI calculations and scale recommendation.",
            "compliance_requirements": ["DPDPA 2023 where personal data is processed", "CERT-In directions", "Applicable Maharashtra government procurement rules"],
            "out_of_scope": ["Statewide rollout before pilot validation", "Replacement of existing core government systems"],
            "pilot_scope": f"Deploy and evaluate the solution with representative {detected_location} operational teams and locations over six months.",
            "pilot_duration": "6 months",
            "pilot_budget": budget,
            "target_locations": [detected_location],
            "evidence_and_success_criteria": "Baseline and endline measurements, system logs, user feedback and independent validation must support the stated KPI targets."
        }

        challenge_data = self._normalize_challenge(challenge_data, prompt)

        # Calculate Quality Score
        quality_res = self.quality_assessor.evaluate(challenge_data)
        challenge_data["quality_score"] = quality_res["quality_score"]
        challenge_data["quality_breakdown"] = quality_res["breakdown"]

        return challenge_data

    def _normalize_challenge(self, data: dict, prompt: str) -> dict:
        """Return one stable response shape for external and deterministic providers."""
        data = dict(data or {})
        data.setdefault("title", "Government Innovation Challenge")
        data.setdefault("short_summary", "A government technology pilot to improve service outcomes with measurable evidence.")
        data.setdefault("problem_statement", prompt.strip())
        data.setdefault("current_situation", data["problem_statement"])
        data.setdefault("pain_points", [])
        data.setdefault("issuing_department", data.get("department", "Government of Maharashtra"))
        data.setdefault("domain_sector", data.get("domain_label", data.get("domain", "Governance")))
        data.setdefault("expected_solution_category", data.get("expected_solution_type", "Government technology solution"))
        data.setdefault("target_beneficiaries", [])
        data.setdefault("desired_outcomes", [data.get("desired_outcome", "Measurable improvement during the pilot")])
        data.setdefault("baseline_metrics", [data.get("baseline_value", "AI-suggested: to be validated")])
        data.setdefault("target_metrics", [data.get("target_value", "AI-suggested target: to be validated")])
        data.setdefault("key_performance_indicators", [{"name": data.get("primary_kpi", "Primary outcome"), "unit": "to be defined", "baseline": data["baseline_metrics"][0], "target": data["target_metrics"][0], "measurement_method": "Pilot measurement plan", "evidence_source": "Department records"}])
        data.setdefault("pilot_scope", data.get("scope", "Representative pilot sites"))
        data.setdefault("pilot_duration", f"{data.get('pilot_duration_months', 6)} months")
        data.setdefault("pilot_budget", data.get("suggested_budget", data.get("budget", "To be determined")))
        data.setdefault("target_locations", [])
        data.setdefault("startup_eligibility", data.get("eligibility_criteria", []))
        criteria = data.get("evaluation_criteria", [])
        if isinstance(criteria, str):
            criteria = [{"criterion": criteria, "weight": 100}]
        data["evaluation_criteria"] = criteria
        data.setdefault("data_requirements", [])
        data.setdefault("cybersecurity_requirements", [])
        data.setdefault("risks_and_mitigation", data.get("risk_mitigation", []))
        data.setdefault("evidence_and_success_criteria", data.get("evidence_requirements", []))
        data.setdefault("ip_policy", data.get("ip_requirements", "To be agreed in procurement documents."))
        data.setdefault("data_policy", "Government retains ownership of government data; access is limited to the pilot purpose.")
        data.setdefault("payment_milestones", [])
        data.setdefault("pilot_milestones", [])
        data.setdefault("scale_criteria", [])
        data.setdefault("independent_validation", "Independent validation of baseline, evidence and outcomes is required.")
        data.setdefault("compliance_requirements", [])
        data.setdefault("out_of_scope", [])
        data.setdefault("implementation_requirements", ["Data integration", "User training", "Operational support", "Exportable evidence"])
        data.setdefault("department", data["issuing_department"])
        data.setdefault("domain", data.get("domain_label", data.get("domain_sector", "governance")))
        data.setdefault("domain_label", data["domain_sector"])
        data.setdefault("expected_solution_type", data["expected_solution_category"])
        data.setdefault("desired_outcome", "; ".join(map(str, data["desired_outcomes"])))
        data.setdefault("scope", data["pilot_scope"])
        data.setdefault("out_of_scope", data.get("out_of_scope", []))
        data.setdefault("primary_kpi", data["key_performance_indicators"][0].get("name", "Primary outcome"))
        data.setdefault("baseline_value", data["baseline_metrics"][0])
        data.setdefault("target_value", data["target_metrics"][0])
        data.setdefault("suggested_budget", data["pilot_budget"])
        return data
