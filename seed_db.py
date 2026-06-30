import json
import os
from pymongo import MongoClient, UpdateOne
from tqdm import tqdm

# Configuration
FILE_PATH = r'd:\[PUB] India_runs_data_and_ai_challenge\redrob-candidate-platform\data\candidates.jsonl'
MONGO_URI = 'mongodb://localhost:27017'
DB_NAME = 'redrob_candidate_platform'
COLLECTION_NAME = 'candidates'

def seed_database():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    print(f"Opening connection to {DB_NAME}...")
    
    if not os.path.exists(FILE_PATH):
        print(f"ERROR: File not found at {FILE_PATH}")
        return

    # Clear existing data for a clean hackathon state
    print("Clearing old records...")
    collection.delete_many({})

    batch = []
    batch_size = 500
    total_processed = 0
    
    print(f"Starting ingestion of 487MB dataset...")
    
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                try:
                    data = json.loads(line)
                    # Use candidate_id as the unique identifier
                    batch.append(UpdateOne(
                        {'candidate_id': data.get('candidate_id')},
                        {'$set': data},
                        upsert=True
                    ))
                    
                    if len(batch) >= batch_size:
                        collection.bulk_write(batch)
                        total_processed += len(batch)
                        print(f"Processed: {total_processed} candidates...")
                        batch = []
                except Exception as e:
                    continue
                    
        if batch:
            collection.bulk_write(batch)
            total_processed += len(batch)

    print(f"🚀 SUCCESS: {total_processed} candidates imported into MongoDB!")
    
    # Create indexes for speed
    print("Creating performance indexes...")
    collection.create_index("candidate_id", unique=True)
    collection.create_index("profile.years_of_experience")
    print("Optimization complete.")

if __name__ == "__main__":
    seed_database()
