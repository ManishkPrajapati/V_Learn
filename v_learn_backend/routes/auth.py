# routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from models.user import UserModel
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from utils.security import blacklist_token, is_token_blacklisted
from utils.db import get_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    if not (username and email and password):
        return jsonify({"error":"username, email and password required"}), 400
    user = UserModel.create_user(username, email, password)
    if not user:
        return jsonify({"error":"user already exists"}), 409
    return jsonify({"msg":"user_created", "user": {"username":user["username"], "email":user["email"]}}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    if not (email and password):
        return jsonify({"error":"email and password required"}), 400
    user = UserModel.verify_user(email, password)
    if not user:
        return jsonify({"error":"invalid credentials"}), 401
    access_token = create_access_token(identity=str(user["_id"]))
    return jsonify({"access_token": access_token, "user": {"email": user["email"], "username": user["username"]}}), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    blacklist_token(jti)
    return jsonify({"msg":"logged_out"}), 200

# Token revocation check
from flask_jwt_extended import JWTManager
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return is_token_blacklisted(jti)

# This gets registered on app creation in app.py after JWTManager created.
# But we also provide a helper to register later:
def register_jwt_callbacks(app, jwt):
    @jwt.token_in_blocklist_loader
    def token_in_blocklist_callback(jwt_header, jwt_payload):
        return check_if_token_revoked(jwt_header, jwt_payload)
