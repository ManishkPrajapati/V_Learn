# app.py
from flask import Flask
from config import Config
from utils.db import init_db
from routes.auth import auth_bp
from routes.generate import gen_bp
from flask_jwt_extended import JWTManager

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions / services
    init_db(app)   # sets app.mongo (pymongo client/db)
    jwt = JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(gen_bp, url_prefix="/api")

    @app.route("/")
    def index():
        return {"status":"ok", "service":"v_learn_backend"}

    return app
