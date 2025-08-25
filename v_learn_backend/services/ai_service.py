# services/ai_service.py
import os
import openai
from flask import current_app

class AIService:
    def __init__(self, openai_api_key=None):
        self.api_key = openai_api_key or current_app.config.get("OPENAI_API_KEY")
        openai.api_key = self.api_key

    def generate_react_component(self, prompt: str, style_guidance: str = "") -> dict:
        """
        Calls OpenAI with a specialized prompt to return a React functional component
        and an HTML snippet that the frontend can drop into a component.
        Returns dict:
            {
                "component_code": "<JSX...>",
                "html_snippet": "<div>...</div>",
                "explanation": "..."
            }
        """
        system = (
            "You are an assistant that outputs a single JSON object with keys: "
            "\"component_code\", \"html_snippet\", \"explanation\". "
            "component_code should be a React functional component (export default) as a string. "
            "html_snippet should be a small HTML block that can be dangerouslySetInnerHTML on frontend. "
            "Do not include backticks in values. Output only JSON."
        )
        user_prompt = (
            f"Topic: {prompt}\n"
            "Produce a dynamic, visual, learning-oriented React functional component (no external assets) "
            "that visualizes the topic, preferably GIF-like animation structure, or a small interactive flow. "
            f"{style_guidance}\n"
            "Keep component self-contained and comment where images or GIFs could be placed. Also provide a plain html_snippet."
        )
        try:
            resp = openai.ChatCompletion.create(
                model="gpt-4o-mini", # or fallback to "gpt-4o" depending on availability
                messages=[
                    {"role":"system","content":system},
                    {"role":"user","content":user_prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
        except Exception as e:
            # fallback or propagate
            raise

        text = resp.choices[0].message.get("content", "")
        # The assistant promised JSON — parse it
        import json
        try:
            data = json.loads(text)
        except Exception:
            # If not JSON, wrap as fallback
            data = {
                "component_code": f"// failed to parse AI response\n/* {text[:500]} */",
                "html_snippet": f"<div>{prompt} — see generated content.</div>",
                "explanation": "AI did not return JSON; raw returned in component_code as comment."
            }
        return data
