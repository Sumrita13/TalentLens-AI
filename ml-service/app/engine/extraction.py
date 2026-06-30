import re
from typing import Dict, Any, List

class JDExtractor:
    def __init__(self):
        # We will use simple heuristics and regex to mock an LLM extraction
        pass

    def extract(self, text: str) -> Dict[str, Any]:
        """
        Parses Job Description text and heuristically extracts fields.
        """
        text_lower = text.lower()
        
        # 1. Experience Years
        exp_years = 0
        exp_match = re.search(r'(\d+)\s*[-to]+\s*(\d+)\s*years?', text_lower)
        if exp_match:
            exp_years = int(exp_match.group(1))
        else:
            exp_match_single = re.search(r'(\d+)\+?\s*years?', text_lower)
            if exp_match_single:
                exp_years = int(exp_match_single.group(1))

        # 2. Skills
        # A dictionary of common tech skills to check against
        common_skills = [
            "python", "java", "javascript", "typescript", "react", "node.js", "c++", 
            "go", "rust", "sql", "nosql", "mongodb", "postgresql", "aws", "azure", 
            "gcp", "docker", "kubernetes", "machine learning", "ai", "deep learning",
            "pytorch", "tensorflow", "nlp", "llm", "rag", "langchain", "vector databases",
            "fastapi", "django", "flask", "express"
        ]
        
        extracted_skills = []
        for skill in common_skills:
            # using word boundaries to avoid partial matches
            if re.search(rf'\b{re.escape(skill)}\b', text_lower):
                extracted_skills.append(skill.title() if len(skill) > 3 else skill.upper())
        
        # Deduplicate and sort
        extracted_skills = sorted(list(set(extracted_skills)))
        
        # Split into required and preferred based on a very naive heuristic
        required_skills = extracted_skills[:max(1, len(extracted_skills) - 2)]
        preferred_skills = extracted_skills[max(1, len(extracted_skills) - 2):]

        # 3. Education
        education_level = "Bachelor's"
        if "master" in text_lower or "ms" in text_lower:
            education_level = "Master's"
        elif "phd" in text_lower or "ph.d" in text_lower:
            education_level = "PhD"

        # 4. Certifications
        certifications = []
        if "aws certified" in text_lower: certifications.append("AWS Certified")
        if "azure certified" in text_lower: certifications.append("Azure Certified")
        
        # 5. Keywords
        keywords = ["Startup", "High-growth"]
        if "remote" in text_lower: keywords.append("Remote")
        if "hybrid" in text_lower: keywords.append("Hybrid")
        
        # 6. Responsibilities (Mocked from sentences containing 'will' or 'responsible')
        responsibilities = []
        sentences = text.split('.')
        for sentence in sentences:
            s_lower = sentence.lower()
            if "you will" in s_lower or "responsible for" in s_lower or "build" in s_lower:
                clean_s = sentence.strip().replace('\n', ' ')
                if len(clean_s) > 10 and clean_s not in responsibilities:
                    responsibilities.append(clean_s)
        
        # Fallback if none found
        if not responsibilities:
            responsibilities = [
                "Design and develop scalable solutions.",
                "Collaborate with cross-functional teams.",
                "Maintain high code quality standards."
            ]

        return {
            "skills": required_skills,
            "preferred_skills": preferred_skills,
            "experience_years": exp_years,
            "education_level": education_level,
            "certifications": certifications,
            "keywords": keywords,
            "responsibilities": responsibilities[:5] # keep it concise
        }
