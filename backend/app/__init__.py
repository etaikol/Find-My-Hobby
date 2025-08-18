from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # PostgreSQL connection string
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/postgres"  # fallback
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": "*"}})  # 👈 allows React frontend to access Flask APIs

    # Import models
    from . import models

    # Register routes
    from .routes import main_bp, auth_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)

    return app