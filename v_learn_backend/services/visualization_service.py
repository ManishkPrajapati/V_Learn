# services/visualization_service.py
from flask import current_app
from utils.db import get_db
from datetime import datetime

class VisualizationService:
    def __init__(self):
        self.db = get_db()

    def save_visualization(self, user_id, prompt, ai_result: dict):
        doc = {
            "user_id": user_id,
            "prompt": prompt,
            "component_code": ai_result.get("component_code"),
            "html_snippet": ai_result.get("html_snippet"),
            "explanation": ai_result.get("explanation"),
            "created_at": datetime.utcnow()
        }
        res = self.db.visualizations.insert_one(doc)
        return self.db.visualizations.find_one({"_id": res.inserted_id})
