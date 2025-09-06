from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError, JWTExtendedException
from dotenv import load_dotenv
from app.logging_config import setup_logging
import logging
import os
from datetime import timedelta

jwt = JWTManager()

@jwt.user_lookup_loader
def user_lookup_callback(jwt_header, jwt_data):
    identity = jwt_data["sub"]
    logging.debug(f"JWT identity in token: {identity}")
    return None  # or lookup user

@jwt.unauthorized_loader
def custom_unauthorized_response(err_str):
    logging.error(f"Missing token error: {err_str}")
    return jsonify({"error": "Missing Authorization Header"}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(err_str):
    logging.error(f"Invalid JWT token: {err_str}")
    return jsonify({"error": "Invalid token"}), 401

@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    logging.error(f"Expired token: {jwt_payload}")
    return jsonify({"error": "Token expired"}), 401


load_dotenv()
db = SQLAlchemy()
migrate = Migrate()

def create_app():


    setup_logging()
    logging.getLogger('werkzeug').handlers = []

    app = Flask(__name__)
    logger = app.logger

    @app.before_request
    def skip_jwt_for_options():
        if request.method == "OPTIONS":
            return '', 200

    logger.info("Initializing Flask app...")

    db_url = (
        f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
        f"@db:5432/{os.getenv('POSTGRES_DB')}"
    )
    safe_db_url = db_url.replace(os.getenv("POSTGRES_PASSWORD"), "****")
    logger.info("Configuring SQLAlchemy with database URL: %s", safe_db_url)

    # PostgreSQL connection string
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=False)
    logger.info("CORS enabled for all origins.")

    # Import models
    from . import models
    logger.info("Models imported: %s", models.__name__)

    # Register routes
    from .routes import all_blueprints
    for bp in all_blueprints:
        app.register_blueprint(bp)
        logger.info("Registered blueprint: %s (url_prefix=%s)", bp.name, bp.url_prefix)


    return app