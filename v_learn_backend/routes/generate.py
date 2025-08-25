# routes/generate.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.ai_service import AIService
from services.visualization_service import VisualizationService
from services.google_ai_service import GoogleAIService
from services.ai_service import AIService

gen_bp = Blueprint("generate", __name__)

# @gen_bp.route("/generate", methods=["POST"])
# @jwt_required()
# def generate_visualization():
#     data = request.json or {}
#     prompt = data.get("prompt")
#     style_guidance = data.get("style_guidance", "")
#     if not prompt:
#         return jsonify({"error":"prompt required"}), 400

#     # Create AI service and call
#     ai = AIService()
#     try:
#         ai_result = ai.generate_react_component(prompt, style_guidance=style_guidance)
#     except Exception as e:
#         current_app.logger.exception("AI generation failed")
#         return jsonify({"error":"AI generation failed", "detail": str(e)}), 500

#     # Save to DB
#     user_id = get_jwt_identity()
#     viz_service = VisualizationService()
#     saved = viz_service.save_visualization(user_id, prompt, ai_result)

#     # Return the generated component + snippet + storage id
#     return jsonify({
#         "generated": ai_result,
#         "saved_id": str(saved["_id"])
#     }), 200

@gen_bp.route("/visualizations", methods=["GET"])
@jwt_required()
def list_visualizations():
    user_id = get_jwt_identity()
    db = current_app.mongo
    docs = list(db.visualizations.find({"user_id": user_id}).sort("created_at", -1))
    # convert _id to string
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify({"visualizations": docs}), 200

@gen_bp.route("/visualizations/<viz_id>", methods=["GET"])
@jwt_required()
def get_visualization(viz_id):
    from bson import ObjectId
    db = current_app.mongo
    doc = db.visualizations.find_one({"_id": ObjectId(viz_id)})
    if not doc:
        return jsonify({"error":"not found"}), 404
    doc["_id"] = str(doc["_id"])
    return jsonify({"visualization": doc}), 200

@gen_bp.route("/generate", methods=["POST"])
@jwt_required()
def generate_visualization():
    data = request.json or {}
    prompt = data.get("prompt")
    style_guidance = data.get("style_guidance", "")
    provider = data.get("provider", "openai")  # default to OpenAI
    
    if not prompt:
        return jsonify({"error":"prompt required"}), 400

    if provider == "google":
        ai = GoogleAIService()
    else:
        ai = AIService()

    try:
        ai_result = ai.generate_react_component(prompt, style_guidance) \
            if provider == "openai" else ai.generate_visualization(prompt, style_guidance)
    except Exception as e:
        current_app.logger.exception("AI generation failed")
        return jsonify({"error": "AI generation failed", "detail": str(e)}), 500

    # Save to DB as before
    user_id = get_jwt_identity()
    viz_service = VisualizationService()
    saved = viz_service.save_visualization(user_id, prompt, ai_result)

    return jsonify({
        "generated": ai_result,
        "saved_id": str(saved["_id"]),
        "provider": provider
    }), 200

