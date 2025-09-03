from flask import Blueprint, jsonify
from app.models import User

user_bp = Blueprint("user", __name__)

@user_bp.route("/users", methods=["GET"])
def get_users():
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

