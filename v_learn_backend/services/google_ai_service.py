# services/google_ai_service.py
import os
import google.generai as genai
from flask import current_app

class GoogleAIService:
    def __init__(self, api_key=None):
        self.api_key = api_key or current_app.config.get("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("Google API key not configured")
        genai.configure(api_key=self.api_key)

    def generate_visualization(self, prompt: str, style_guidance: str = "") -> dict:
        """
        Uses Google Gemini API to generate a React component and HTML snippet
        similar to AIService.
        """
        system_prompt = (
            "You are an assistant that outputs JSON with keys: "
            "\"component_code\", \"html_snippet\", \"explanation\". "
            "component_code: React functional component string; "
            "html_snippet: HTML snippet string for direct rendering; "
            "explanation: textual description. Output strictly valid JSON."
        )
        user_prompt = (
            f"Topic: {prompt}\n"
            "Generate a learning visualization as described above. "
            f"{style_guidance}\n"
            "Keep it dynamic and illustrative, not bullet points."
        )
        try:
            model = genai.GenerativeModel("gemini-pro")  # or gemini-1.5-pro if enabled
            response = model.generate_content([system_prompt, user_prompt])
            text = response.text.strip()
            import json
            data = json.loads(text)
        except Exception as e:
            # fallback if invalid JSON or API error
            data = {
                "component_code": f"// Error generating with Google AI: {e}",
                "html_snippet": f"<div>{prompt} visualization could not be generated</div>",
                "explanation": "Error from Google AI."
            }
        return data
