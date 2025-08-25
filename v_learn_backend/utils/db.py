# utils/db.py
from pymongo import MongoClient
from flask import current_app

def init_db(app):
    uri = app.config.get("MONGO_URI")
    client = MongoClient(uri)
    # Example: db name from path or v_learn_db default
    dbname = uri.rsplit("/", 1)[-1] or "v_learn_db"
    db = client[dbname]
    # attach to app for route access: app.mongo.db
    app.mongo_client = client
    app.mongo = db

def get_db():
    from flask import current_app
    return current_app.mongo
