# models/user.py
from utils.db import get_db
from utils.security import hash_password, verify_password
from datetime import datetime

class UserModel:
    @staticmethod
    def create_user(username, email, password):
        db = get_db()
        existing = db.users.find_one({"email": email})
        if existing:
            return None
        user = {
            "username": username,
            "email": email,
            "password": hash_password(password),
            "created_at": datetime.utcnow(),
        }
        res = db.users.insert_one(user)
        user["_id"] = res.inserted_id
        del user["password"]
        return user

    @staticmethod
    def find_by_email(email):
        db = get_db()
        user = db.users.find_one({"email": email})
        return user

    @staticmethod
    def verify_user(email, password):
        db = get_db()
        user = db.users.find_one({"email": email})
        if not user:
            return None
        if verify_password(user["password"], password):
            user_copy = user.copy()
            del user_copy["password"]
            return user_copy
        return None
