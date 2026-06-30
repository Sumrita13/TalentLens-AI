import json
import os

path = r'd:\[PUB] India_runs_data_and_ai_challenge\redrob-candidate-platform\data\candidates.jsonl'

print(f"Checking file at: {path}")
if not os.path.exists(path):
    print("ERROR: File not found!")
else:
    size_mb = os.path.getsize(path) / (1024 * 1024)
    print(f"File size: {size_mb:.2f} MB")
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            count = 0
            for line in f:
                if line.strip():
                    json.loads(line)
                    count += 1
                if count >= 1000: break # Just check first 1000
        print(f"SUCCESS: First 1000 lines are valid JSONL. Total checks passed.")
    except Exception as e:
        print(f"ERROR reading file: {str(e)}")
