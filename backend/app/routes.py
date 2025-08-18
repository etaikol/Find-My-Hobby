from flask import Blueprint, jsonify, request
from .models import User, Hobby, Group, Event
from werkzeug.security import generate_password_hash

from . import db

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
main_bp = Blueprint("main", __name__)

@main_bp.route("/test")
def test():
    return {"message": "Backend is working with CORS enabled!"}

# Example: get all users
@main_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email
    } for u in users])

# Example: create a user
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if email already exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"])  # ✅ hashed
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "id": new_user.id}), 201