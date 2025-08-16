from flask import Blueprint, jsonify, request
from .models import User, Hobby, Group, Event
from . import db

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
@main_bp.route("/users", methods=["POST"])
def create_user():
    data = request.json
    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=data["password"]  # ⚠️ in real app: hash this
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created", "id": new_user.id}), 201