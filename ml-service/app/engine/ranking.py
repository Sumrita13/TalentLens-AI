import numpy as np
from sentence_transformers import SentenceTransformer, util
from typing import List, Dict, Any

class RankingEngine:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def calculate_semantic_similarity(self, jd: str, profiles: List[str]) -> np.ndarray:
        jd_embedding = self.model.encode(jd, convert_to_tensor=True)
        profile_embeddings = self.model.encode(profiles, convert_to_tensor=True)
        cosine_scores = util.cos_sim(jd_embedding, profile_embeddings)
        return cosine_scores.cpu().numpy().flatten()

    def rank(self, jd: str, candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        profile_strings = []
        for c in candidates:
            profile = c.get('profile') or {}
            skills = ", ".join([s.get('name', '') for s in (c.get('skills') or [])])
            career = " ".join([f"{h.get('title')} at {h.get('company')}: {h.get('description')}" for h in (c.get('career_history') or [])])
            profile_strings.append(f"{profile.get('headline')} {profile.get('summary')} {skills} {career}")

        semantic_scores = self.calculate_semantic_similarity(jd, profile_strings)

        ranked_results = []
        for i, candidate in enumerate(candidates):
            profile = candidate.get('profile') or {}
            
            # Scores
            skill_score = self._calculate_skill_match(jd, candidate.get('skills') or [])
            exp_score = self._calculate_experience_match(jd, profile.get('years_of_experience', 0))
            edu_score = self._calculate_education_score(candidate.get('education') or [])
            behavior_score = self._calculate_behavioral_score(candidate.get('redrob_signals') or {})
            
            # Risk Engine
            risk_score, risk_factors = self._calculate_risk_score(candidate)
            
            # Semantic
            semantic_score = float(semantic_scores[i])

            # Final Aggregation
            base_score = (
                (skill_score * 0.30) + 
                (exp_score * 0.15) + 
                (edu_score * 0.10) +
                (behavior_score * 0.20) + 
                (semantic_score * 0.25)
            )
            
            # Penalize by risk score
            final_score = base_score * (1.0 - (risk_score * 0.5))

            ranked_results.append({
                "candidate_id": candidate.get('candidate_id'),
                "scores": {
                    "skill_match": skill_score,
                    "experience_match": exp_score,
                    "education_match": edu_score,
                    "behavioral_score": behavior_score,
                    "semantic_similarity": semantic_score,
                    "risk_score": risk_score
                },
                "final_score": max(0, min(1, float(final_score))),
                "justification": self._generate_justification(
                    candidate, jd, skill_score, exp_score, edu_score, behavior_score, semantic_score, risk_score, risk_factors
                )
            })

        return sorted(ranked_results, key=lambda x: x['final_score'], reverse=True)

    def _calculate_experience_match(self, jd: str, exp_years: int) -> float:
        # Simplistic heuristic for now based on common JD
        if 5 <= exp_years <= 9: return 1.0
        if 3 <= exp_years <= 12: return 0.7
        return 0.3

    def _calculate_risk_score(self, candidate: Dict[str, Any]) -> tuple:
        risk_score = 0.0
        factors = []
        
        # 1. Skill inflation
        skills = candidate.get('skills') or []
        exp_years = (candidate.get('profile') or {}).get('years_of_experience', 0)
        expert_skills = [s for s in skills if s.get('proficiency') == 'expert']
        
        if len(expert_skills) > 5 and exp_years < 3:
            risk_score += 0.4
            factors.append("Unrealistic skill proficiency given low years of experience.")
            
        # 2. Frequent job hopping
        career = candidate.get('career_history') or []
        short_stints = [c for c in career if c.get('duration_months', 0) > 0 and c.get('duration_months', 0) < 8]
        if len(short_stints) >= 3:
            risk_score += 0.3
            factors.append("Pattern of very short tenure across multiple roles.")
            
        # 3. Low profile completeness
        signals = candidate.get('redrob_signals') or {}
        if signals.get('profile_completeness_score', 100) < 50:
            risk_score += 0.2
            factors.append("Incomplete profile data.")
            
        # 4. Keyword stuffing
        title = (candidate.get('profile') or {}).get('current_title', '').lower()
        ai_keywords = {"rag", "llm", "embeddings", "vector", "pytorch"}
        skill_names = [s.get('name', '').lower() for s in skills]
        has_ai_skills = sum(1 for k in ai_keywords if any(k in sn for sn in skill_names)) > 2
        is_ai_title = any(k in title for k in ["engineer", "data scientist", "ml", "ai", "developer"])
        
        if has_ai_skills and not is_ai_title:
            risk_score += 0.3
            factors.append("High volume of AI keywords but unrelated job title.")

        return min(1.0, risk_score), factors

    def _calculate_behavioral_score(self, signals: Dict[str, Any]) -> float:
        if not signals: return 0.5
        
        response_rate = signals.get('recruiter_response_rate', 0.5)
        completion_rate = signals.get('interview_completion_rate', 0.5)
        github = signals.get('github_activity_score', 0)
        profile_views = signals.get('profile_views_received_30d', 0)
        
        # Normalize github (0-100)
        gh_score = min(1.0, github / 100.0)
        
        # Active view score
        view_score = min(1.0, profile_views / 50.0)
        
        score = (response_rate * 0.3) + (completion_rate * 0.3) + (gh_score * 0.2) + (view_score * 0.2)
        
        if not signals.get('open_to_work_flag', True): 
            score *= 0.6
            
        return score

    def _calculate_skill_match(self, jd: str, skills: List[Dict[str, Any]]) -> float:
        if not skills: return 0.0
        match_count = 0
        total_weight = 0
        jd_lower = jd.lower()
        for s in skills:
            name = s.get('name', '').lower()
            prof = s.get('proficiency', 'beginner')
            if isinstance(prof, str): prof = prof.lower()
            else: prof = 'beginner'
            weight = {"beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}.get(prof, 1)
            
            if name in jd_lower:
                match_count += weight
            total_weight += weight
            
        return match_count / total_weight if total_weight > 0 else 0.0

    def _calculate_education_score(self, education: List[Dict[str, Any]]) -> float:
        if not education: return 0.0
        tiers = {"tier_1": 1.0, "tier_2": 0.8, "tier_3": 0.6, "tier_4": 0.4, "unknown": 0.2}
        best_tier_score = max([tiers.get(e.get('tier', 'unknown'), 0.2) for e in education])
        return best_tier_score

    def _generate_justification(self, candidate, jd, skills_s, exp_s, edu_s, behavior_s, semantic_s, risk_s, risk_factors):
        strengths = []
        if skills_s > 0.7: strengths.append("Excellent alignment with required technical skills.")
        if semantic_s > 0.7: strengths.append("High semantic relevance to job description.")
        if behavior_s > 0.8: strengths.append("Strong behavioral indicators and active engagement.")
        if edu_s >= 0.8: strengths.append("Premium educational background.")
        
        weaknesses = []
        if skills_s < 0.4: weaknesses.append("Lacks several core technical skills.")
        if behavior_s < 0.4: weaknesses.append("Low engagement or responsiveness signals.")
        if risk_s > 0.3: weaknesses.extend(risk_factors)
        
        # Missing skills heuristic
        jd_common_skills = ["python", "react", "node", "aws", "sql", "machine learning"]
        cand_skills = [s.get('name', '').lower() for s in (candidate.get('skills') or [])]
        missing = [skill for skill in jd_common_skills if skill in jd.lower() and not any(skill in cs for cs in cand_skills)]
        
        recommendation = "Strong Hire" if (skills_s > 0.6 and semantic_s > 0.6 and risk_s < 0.3) else ("Proceed with Caution" if risk_s >= 0.3 else "Not Recommended")
        
        justification_parts = []
        if strengths:
            justification_parts.append(strengths[0])
        if risk_s > 0.3 and risk_factors:
            justification_parts.append(f"Caution: {risk_factors[0]}")
        elif missing:
            justification_parts.append(f"Missing: {', '.join(missing[:2])}.")
            
        ranking_justification = " ".join(justification_parts) if justification_parts else f"Solid candidate with {skills_s*100:.0f}% skill match."
        
        return {
            "overall_match_score": f"{((skills_s*0.3 + exp_s*0.15 + edu_s*0.1 + behavior_s*0.2 + semantic_s*0.25)*(1-risk_s*0.5))*100:.0f}%",
            "strengths": strengths if strengths else ["Satisfactory baseline experience."],
            "weaknesses": weaknesses if weaknesses else ["No major weaknesses detected."],
            "missing_skills": missing,
            "hiring_recommendation": recommendation,
            "ranking_justification": ranking_justification
        }
