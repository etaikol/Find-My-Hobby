from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from app.logging_config import setup_logging
import logging
import os

load_dotenv()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    setup_logging()
    logging.getLogger('werkzeug').handlers = []

    app = Flask(__name__)
    logger = app.logger

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
    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # 👈 allows React frontend to access Flask APIs
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