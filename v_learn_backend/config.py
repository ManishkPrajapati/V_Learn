# config.py
import os
from dotenv import load_dotenv
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/v_learn_db")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    TOKEN_EXPIRES_MINUTES = int(os.environ.get("TOKEN_EXPIRES_MINUTES", 60))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=TOKEN_EXPIRES_MINUTES)
