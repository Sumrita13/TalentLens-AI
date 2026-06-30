from fastapi import FastAPI, HTTPException
import json
import os
from typing import Optional
from pymongo import MongoClient
from engine.ranking import RankingEngine
from engine.extraction import JDExtractor
from engine.interview import InterviewQuestionGenerator

app = FastAPI(title="Candidate Ranking ML Service")
engine = RankingEngine()
extractor = JDExtractor()
interview_generator = InterviewQuestionGenerator()

# Database Configuration
MONGO_URI = 'mongodb://localhost:27017'
DB_NAME = 'redrob_candidate_platform'
COLLECTION_NAME = 'candidates'

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/extract_jd")
def extract_jd(payload: dict):
    text = payload.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        return extractor.extract(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_interview_questions")
def generate_interview_questions(payload: dict):
    candidate = payload.get("candidate")
    jd = payload.get("jd")
    if not candidate or not jd:
        raise HTTPException(status_code=400, detail="candidate and jd are required")
    try:
        return {"questions": interview_generator.generate(candidate, jd)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare_candidates")
def compare_candidates(payload: dict):
    candidateA = payload.get("candidateA")
    candidateB = payload.get("candidateB")
    jd = payload.get("jd", "")
    
    if not candidateA or not candidateB:
        raise HTTPException(status_code=400, detail="candidateA and candidateB are required")
        
    try:
        # Run ranking on both just to get justifications and scores
        results = engine.rank(jd, [candidateA, candidateB])
        
        # Determine winner
        winner = results[0]
        loser = results[1]
        
        return {
            "winner_id": winner["candidate_id"],
            "loser_id": loser["candidate_id"],
            "winner_score": winner["final_score"],
            "loser_score": loser["final_score"],
            "explanation": {
                "who_is_better": f"Candidate {winner['candidate_id']} is better aligned with the role.",
                "why": "Higher overall match score considering technical fit, behavioral signals, and lower risk.",
                "strengths_comparison": f"The winner demonstrated {winner['justification']['strengths'][0] if winner['justification']['strengths'] else 'better fundamentals'}.",
                "weaknesses": "Both candidates exhibit potential gaps, but the winner's missing skills are less critical.",
                "risk_comparison": f"Winner Risk: {winner['scores']['risk_score']*100:.0f}% vs Other Risk: {loser['scores']['risk_score']*100:.0f}%"
            },
            "detailed_scores": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rank/local")
async def rank_from_db(payload: dict):
    """
    Ranks candidates. Can take jd_text and candidates_data in payload,
    or falls back to reading from disk/DB if missing.
    """
    jd_text = payload.get("jd_text")
    candidates = payload.get("candidates_data")

    # Path to the data directory relative to this service
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
    
    if not jd_text:
        jd_path = os.path.join(DATA_DIR, "job_description.md")
        if not os.path.exists(jd_path):
            raise HTTPException(status_code=404, detail="JD text not provided and job_description.md not found")
        with open(jd_path, 'r', encoding='utf-8') as f:
            jd_text = f.read()

    try:
        if not candidates:
            # Fetch Candidates from MongoDB
            client = MongoClient(MONGO_URI)
            db = client[DB_NAME]
            collection = db[COLLECTION_NAME]
            
            # Fetch first 10,000 for efficiency
            candidates = list(collection.find({}, {'_id': 1, 'candidate_id': 1, 'profile': 1, 'skills': 1, 'education': 1, 'career_history': 1, 'redrob_signals': 1}).limit(10000))
            
            # Convert ObjectId to string for JSON serialization
            for c in candidates:
                c['_id'] = str(c['_id'])
            
            if not candidates:
                raise HTTPException(status_code=404, detail="No candidates found in database.")

        print(f"Neural Engine: Fetched {len(candidates)} candidates from DB. Commencing ranking...")

        # 3. Process with Engine
        results = engine.rank(jd_text, candidates)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
