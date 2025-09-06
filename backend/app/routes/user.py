from flask import Blueprint, jsonify, request
from app.models import User, db
from flask_jwt_extended import jwt_required
import logging

user_bp = Blueprint("user", __name__)
logger = logging.getLogger(__name__)

@user_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    auth_header = request.headers.get("Authorization")
    logger.info("Authorization header received: %s", auth_header)
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": u.role
    } for u in users])

@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    })

@user_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)

    db.session.commit()

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    })

@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"User {user_id} deleted successfully."}), 200

# Get all groups a user belongs to
@user_bp.route("/users/<int:user_id>/groups", methods=["GET"])
def get_user_groups(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    groups = []
    for g in user.groups:
        groups.append({
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "creator": {
                "id": g.creator.id,
                "username": g.creator.username
            } if hasattr(g, "creator") and g.creator else None,
            "created_at": g.created_at.isoformat()
        })

    return jsonify(groups)

