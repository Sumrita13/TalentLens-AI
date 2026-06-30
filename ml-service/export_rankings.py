import pandas as pd
from pymongo import MongoClient
import os

MONGO_URI = 'mongodb://localhost:27017'
DB_NAME = 'redrob_candidate_platform'

def export_rankings_to_excel():
    print("Connecting to MongoDB...")
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("Fetching rankings...")
    rankings_collection = db['rankings']
    candidates_collection = db['candidates']
    
    rankings = list(rankings_collection.find().sort("final_score", -1))
    
    if not rankings:
        print("No rankings found in database. Please run a ranking via the UI first.")
        return
        
    print(f"Found {len(rankings)} ranked candidates. Processing for export...")
    
    data = []
    rank = 1
    for r in rankings:
        cand_id = r.get('candidate_id_str', 'Unknown')
        
        # Try to get candidate name from candidates collection
        cand = candidates_collection.find_one({"candidate_id": cand_id})
        name = cand_id
        if cand and 'profile' in cand and 'anonymized_name' in cand['profile']:
            name = cand['profile']['anonymized_name']
            
        scores = r.get('scores', {})
        justification = r.get('justification', {})
        
        # Calculate Risk Category
        penalties = scores.get('penalties', 0)
        risk = "Low"
        if penalties > 0.3:
            risk = "High"
        elif penalties > 0.1:
            risk = "Medium"
            
        data.append({
            "Rank": rank,
            "Candidate ID": cand_id,
            "Candidate Name": name,
            "Final Score (%)": round(r.get('final_score', 0) * 100, 1),
            "Skill Match (%)": round(scores.get('skill_match', 0) * 100, 1),
            "Behavioral Score (%)": round(scores.get('behavioral_score', 0) * 100, 1),
            "Risk Level": risk,
            "AI Recommendation": justification.get('hiring_recommendation', 'N/A'),
            "AI Justification": justification.get('ranking_justification', 'Strong semantic match.')
        })
        rank += 1
        
    df = pd.DataFrame(data)
    output_path = os.path.join(os.path.dirname(__file__), "ranked_candidates.xlsx")
    
    print(f"Writing to {output_path}...")
    df.to_excel(output_path, index=False)
    print("Export Complete! ✨")

if __name__ == "__main__":
    export_rankings_to_excel()
