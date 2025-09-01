from flask import Blueprint, jsonify, request
from app.models import db, Group, User

group_bp = Blueprint("group", __name__)

# Get all groups
@group_bp.route("/groups", methods=["GET"])
def get_groups():
    groups = Group.query.all()
    return jsonify([{"id": g.id, "name": g.name, "description": g.description} for g in groups])

# Get single group
@group_bp.route("/groups/<int:group_id>", methods=["GET"])
def get_group(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404
    return jsonify({
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "members": [{"id": m.id, "username": m.username} for m in group.members]
    })

# Create a group
@group_bp.route("/groups", methods=["POST"])
def create_group():
    data = request.json
    name = data.get("name")
    description = data.get("description")
    creator_id = data.get("creator_id")
    creator = User.query.get(creator_id)
    if not creator:
        return jsonify({"error": "Creator not found"}), 404
    group = Group(name=name, description=description, creator_id=creator_id)
    db.session.add(group)
    db.session.commit()
    return jsonify({"id": group.id, "name": group.name, "description": group.description}), 201

# Add member to group
@group_bp.route("/groups/<int:group_id>/members", methods=["POST"])
def add_group_member(group_id):
    data = request.json
    user_id = data.get("user_id")
    role = data.get("role", "member")
    group = Group.query.get(group_id)
    user = User.query.get(user_id)
    if not group or not user:
        return jsonify({"error": "Group or User not found"}), 404
    group.members.append(user)
    # Set role in association table
    db.session.execute(
        "UPDATE group_members SET role=:role WHERE group_id=:gid AND user_id=:uid",
        {"role": role, "gid": group_id, "uid": user_id}
    )
    db.session.commit()
    return jsonify({"message": f"User {user.username} added to group {group.name} as {role}"})