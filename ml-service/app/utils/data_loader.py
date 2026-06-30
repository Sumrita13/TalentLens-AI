import json
import gzip
from typing import List, Dict, Any

class DataLoader:
    @staticmethod
    def load_jsonl(path: str, limit: int = 1000) -> List[Dict[str, Any]]:
        """
        Loads candidates from a .jsonl or .jsonl.gz file.
        """
        data = []
        try:
            open_func = gzip.open if path.endswith('.gz') else open
            with open_func(path, 'rt', encoding='utf-8') as f:
                for i, line in enumerate(f):
                    if i >= limit:
                        break
                    data.append(json.loads(line))
            return data
        except Exception as e:
            print(f"Error loading data: {e}")
            return []
