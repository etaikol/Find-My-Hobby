from flask import Blueprint, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app import db
import logging

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
logger = logging.getLogger(__name__)   # 👈 logger specific to this file

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    logger.info(
        "Registering user with username=%s, email=%s",
        data["username"],
        data["email"]
    )

    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"])
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "id": new_user.id}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if user and check_password_hash(user.password_hash, data.get("password")):
        session["user_id"] = user.id
        return jsonify({"message": "Login successful", "id": user.id}), 200
    return jsonify({"error": "Invalid credentials"}), 401
