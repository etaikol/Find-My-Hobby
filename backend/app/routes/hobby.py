from flask import Blueprint, jsonify, request
from app.models import db, Hobby, User

hobby_bp = Blueprint("hobby", __name__)

# Get all hobbies
@hobby_bp.route("/hobbies", methods=["GET"])
def get_hobbies():
    hobbies = Hobby.query.all()
    return jsonify([{"id": h.id, "name": h.name} for h in hobbies])

# Get a single hobby
@hobby_bp.route("/hobbies/<int:hobby_id>", methods=["GET"])
def get_hobby(hobby_id):
    hobby = Hobby.query.get(hobby_id)
    if not hobby:
        return jsonify({"error": "Hobby not found"}), 404
    return jsonify({"id": hobby.id, "name": hobby.name})

# Create a new hobby
@hobby_bp.route("/hobbies", methods=["POST"])
def create_hobby():
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400
    hobby = Hobby(name=name)
    db.session.add(hobby)
    db.session.commit()
    return jsonify({"id": hobby.id, "name": hobby.name, ""}), 201

# Assign hobby to a user
@hobby_bp.route("/users/<int:user_id>/hobbies", methods=["POST"])
def add_user_hobby(user_id):
    data = request.json
    hobby_id = data.get("hobby_id")
    user = User.query.get(user_id)
    hobby = Hobby.query.get(hobby_id)
    if not user or not hobby:
        return jsonify({"error": "User or Hobby not found"}), 404
    user.hobbies.append(hobby)
    db.session.commit()
    return jsonify({"message": f"Hobby {hobby.name} added to user {user.username}"})