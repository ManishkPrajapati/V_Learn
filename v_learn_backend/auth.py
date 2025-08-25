from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from utils.db import users_col, revoked_tokens_col
from datetime import datetime, timezone

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

def _user_doc_safe(user_doc):
    if not user_doc:
        return None
    safe = {k:v for k,v in user_doc.items() if k not in ("password_hash",)}
    safe["_id"] = str(user_doc.get("_id"))
    return safe

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")
    name = data.get("name", "")

    if not username or not password:
        return jsonify({"msg": "username and password required"}), 400

    if users_col.find_one({"username": username}):
        return jsonify({"msg": "username already exists"}), 409

    password_hash = generate_password_hash(password)
    user = {
        "username": username,
        "password_hash": password_hash,
        "name": name,
        "created_at": datetime.now(timezone.utc)
    }
    res = users_col.insert_one(user)
    user["_id"] = str(res.inserted_id)
    return jsonify({"msg":"registered", "user": _user_doc_safe(user)}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"msg":"username and password required"}), 400

    user = users_col.find_one({"username": username})
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"msg":"bad credentials"}), 401

    identity = {"sub": str(user["_id"]), "username": user["username"]}
    access = create_access_token(identity=identity)
    refresh = create_refresh_token(identity=identity)
    return jsonify({"access_token": access, "refresh_token": refresh, "user": _user_doc_safe(user)}), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access = create_access_token(identity=identity)
    return jsonify({"access_token": access}), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    revoked_tokens_col.insert_one({"jti": jti, "revoked_at": now})
    return jsonify({"msg":"access token revoked"}), 200
