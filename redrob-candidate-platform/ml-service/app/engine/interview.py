from typing import Dict, Any, List

class InterviewQuestionGenerator:
    def __init__(self):
        pass

    def generate(self, candidate: Dict[str, Any], jd_text: str) -> List[Dict[str, str]]:
        """
        Generates simulated AI interview questions based on the candidate's profile and the JD.
        """
        questions = []
        
        # 1. Technical / Skill-based
        # Find skills in candidate's profile
        skills = [s.get('name', '') for s in (candidate.get('skills') or [])]
        if skills:
            top_skill = skills[0]
            questions.append({
                "type": "Technical",
                "question": f"Can you explain your experience with {top_skill}? What is the most complex system you've built using it?",
                "rationale": f"Candidate claims proficiency in {top_skill}."
            })
            
        # 2. Behavioral
        signals = candidate.get('redrob_signals', {})
        if signals.get('interview_completion_rate', 0) < 0.5:
            questions.append({
                "type": "Behavioral",
                "question": "We noticed you've explored several opportunities recently. What exactly are you looking for in your next role to ensure a long-term fit?",
                "rationale": "Candidate has a low historical interview completion rate."
            })
        else:
            questions.append({
                "type": "Behavioral",
                "question": "Tell us about a time you had to deliver a project under extreme time constraints. How did you prioritize?",
                "rationale": "Standard behavioral check for high-growth environment."
            })

        # 3. Project / Scenario
        experience = candidate.get('career_history') or []
        if experience:
            latest_role = experience[0]
            company = latest_role.get('company', 'your previous company')
            questions.append({
                "type": "Scenario-based",
                "question": f"During your time at {company}, how did you measure the impact of your engineering work on business outcomes?",
                "rationale": f"Validating impact at {company}."
            })
        else:
            questions.append({
                "type": "Scenario-based",
                "question": "If you joined our team tomorrow and were tasked with redesigning the core database architecture, what would be your first 3 steps?",
                "rationale": "Testing architectural thinking for a candidate with limited history."
            })
            
        # 4. Missing Skills / Weakness Probing
        # Simple heuristic: if JD text has "Python" and candidate skills don't.
        if "python" in jd_text.lower() and not any("python" in s.lower() for s in skills):
            questions.append({
                "type": "Skill Gap",
                "question": "This role requires strong Python skills, which seems to be missing from your resume. Can you talk about your ability to ramp up on new languages quickly?",
                "rationale": "Probing a potential skill gap identified by the AI."
            })
            
        return questions
