import sys
import os
sys.path.append('d:/[PUB] India_runs_data_and_ai_challenge/redrob-candidate-platform/ml-service')
from app.engine.ranking import RankingEngine
import json

engine = RankingEngine()
jd = "Looking for a Python developer with AI experience."
candidates = []
try:
    with open('d:/[PUB] India_runs_data_and_ai_challenge/redrob-candidate-platform/data/candidates.jsonl', 'r') as f:
        for _ in range(10):
            line = f.readline()
            if not line: break
            candidates.append(json.loads(line))
    
    results = engine.rank(jd, candidates)
    print("Success, results:", len(results))
except Exception as e:
    import traceback
    traceback.print_exc()
