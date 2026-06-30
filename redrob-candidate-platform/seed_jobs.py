import json
from pymongo import MongoClient

# Configuration
MONGO_URI = 'mongodb://localhost:27017'
DB_NAME = 'redrob_candidate_platform'

def seed_jobs():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db['jobs']
    
    print(f"Opening connection to {DB_NAME} to seed jobs...")
    
    jobs = [
        {
            "title": "Senior Frontend Architect",
            "description": "We are looking for an expert in React, TypeScript, and modern CSS architectures to lead our dashboard development. Experience with Framer Motion and complex data visualization is a plus.",
            "requirements": {
                "skills": ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Recharts"],
                "experience_years": 7,
                "education_level": "Bachelor's in Computer Science",
                "keywords": ["Frontend", "Architect", "Lead"]
            }
        },
        {
            "title": "Machine Learning Engineer",
            "description": "Build and deploy scalable ML models for candidate ranking. Knowledge of Sentence-Transformers, PyTorch, and FastAPI is essential.",
            "requirements": {
                "skills": ["Python", "FastAPI", "PyTorch", "Sentence-Transformers", "MongoDB"],
                "experience_years": 4,
                "education_level": "Master's in AI/ML",
                "keywords": ["ML", "NLP", "Python"]
            }
        },
        {
            "title": "Full Stack Developer (Next.js/Node)",
            "description": "Develop end-to-end features for our talent intelligence platform using modern full-stack technologies.",
            "requirements": {
                "skills": ["Node.js", "Express", "Next.js", "MongoDB", "TypeScript"],
                "experience_years": 3,
                "education_level": "Bachelor's Degree",
                "keywords": ["Full Stack", "NodeJS", "TypeScript"]
            }
        }
    ]

    # Clear existing jobs
    collection.delete_many({})
    
    # Insert new jobs
    result = collection.insert_many(jobs)
    print(f"✅ SUCCESS: {len(result.inserted_ids)} default jobs created!")

if __name__ == "__main__":
    seed_jobs()
