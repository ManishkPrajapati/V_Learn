# utils/security.py
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from utils.db import get_db
from datetime import datetime, timedelta
from flask_jwt_extended import decode_token

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def verify_password(hash, password: str) -> bool:
    return check_password_hash(hash, password)

def blacklist_token(jti: str):
    db = get_db()
    db.token_blacklist.insert_one({"jti": jti, "created_at": datetime.utcnow()})

def is_token_blacklisted(jti: str) -> bool:
    db = get_db()
    return db.token_blacklist.find_one({"jti": jti}) is not None

def get_jwt_identity_from_token(token):
    # helper to decode without requiring context
    return decode_token(token)
