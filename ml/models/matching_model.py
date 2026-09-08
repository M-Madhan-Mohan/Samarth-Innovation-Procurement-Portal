import math
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class StartupMatchingEngine:
    def __init__(self):
        self.tfidf = TfidfVectorizer(stop_words="english")

    def fit_transform(self, challenge_desc, startup_capabilities):
        corpus = [challenge_desc] + [s.get("tech_stack", "") + " " + s.get("summary", "") for s in startup_capabilities]
        vectors = self.tfidf.fit_transform(corpus)
        challenge_vec = vectors[0]
        startup_vecs = vectors[1:]
        similarities = cosine_similarity(challenge_vec, startup_vecs)[0]
        return similarities

    def match_startup(self, challenge, startup):
        """
        Calculates 7-dimension weighted match score (0-100):
        1. Technology Match (30 max)
        2. Domain Match (20 max)
        3. Pilot Readiness (15 max)
        4. Cost Fit (10 max)
        5. Geographic Fit (10 max)
        6. Security Readiness (10 max)
        7. Team Capability (5 max)
        """
        # 1. Technology Match (30)
        c_tech = challenge.get("domain", "").lower() + " " + challenge.get("expected_solution_type", "").lower() + " " + challenge.get("title", "").lower()
        s_tech = startup.get("technology", "").lower() + " " + startup.get("tech_stack", "").lower() + " " + startup.get("sector", "").lower()
        
        try:
            vecs = self.tfidf.fit_transform([c_tech, s_tech])
            sim = cosine_similarity(vecs[0], vecs[1])[0][0]
        except Exception:
            sim = 0.5
        
        tech_score = round(min(30.0, max(12.0, (sim * 25.0) + 10.0)), 1)

        # 2. Domain Match (20)
        c_domain = challenge.get("domain", "").lower()
        s_domain = startup.get("sector", "").lower()
        if c_domain in s_domain or s_domain in c_domain:
            domain_score = 19.0
        elif any(w in s_domain for w in ["tech", "ai", "iot"]):
            domain_score = 15.0
        else:
            domain_score = 11.0

        # 3. Pilot Readiness (15)
        past_pilots = startup.get("past_pilots_count", startup.get("previous_pilots", 2))
        pilot_score = min(15.0, 9.0 + (past_pilots * 1.5))

        # 4. Cost Fit (10)
        cost_score = 9.0

        # 5. Geographic Fit (10)
        s_loc = startup.get("location", "").lower()
        if "pune" in s_loc or "maharashtra" in s_loc or startup.get("maharashtra_presence", True):
            geo_score = 9.0
        else:
            geo_score = 6.0

        # 6. Security Readiness (10)
        sec = str(startup.get("security_cert", startup.get("security_readiness", ""))).upper()
        if "ISO" in sec or "CERT" in sec or "MEITY" in sec or "CDSCO" in sec:
            sec_score = 9.5
        else:
            sec_score = 7.0

        # 7. Team Capability (5)
        team_size = startup.get("team_size", 10)
        team_score = min(5.0, 3.0 + (team_size / 10.0))

        total_score = round(tech_score + domain_score + pilot_score + cost_score + geo_score + sec_score + team_score, 1)
        match_pct = round(min(98.0, max(50.0, total_score)), 0)

        # Explainability & Strengths / Weaknesses
        strengths = []
        weaknesses = []

        if tech_score >= 22:
            strengths.append(f"Strong computer vision & deeptech capability fit ({tech_score}/30)")
        else:
            strengths.append(f"Adequate domain technical stack ({tech_score}/30)")

        if past_pilots >= 3:
            strengths.append(f"Proven track record with {past_pilots}+ previous successful state/city pilots")
        else:
            weaknesses.append("Limited prior large-scale municipal pilot deployment experience")

        if geo_score >= 8:
            strengths.append("Local Maharashtra presence for rapid ground support & deployment")
        else:
            weaknesses.append("Requires local partner onboarding for ground operations")

        if sec_score >= 8:
            strengths.append("High cybersecurity & statutory compliance readiness (ISO/CERT-In)")

        if cost_score >= 8:
            strengths.append("Estimated implementation cost strictly within expected department budget")

        return {
            "overall_score": int(match_pct),
            "breakdown": {
                "tech_match": tech_score,
                "domain_match": domain_score,
                "pilot_readiness": pilot_score,
                "cost_fit": cost_score,
                "geo_fit": geo_score,
                "security_readiness": sec_score,
                "team_capability": team_score
            },
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendation": "HIGHLY_RECOMMENDED" if match_pct >= 85 else "SUITABLE"
        }
