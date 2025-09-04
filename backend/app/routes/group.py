from flask import Blueprint, jsonify, request
from app.models import db, Group, User
from sqlalchemy.orm import joinedload
from sqlalchemy import text

group_bp = Blueprint("group", __name__)

# ---------------------------
# Helper to get group with members
# ---------------------------
def serialize_group(group):
    return {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "creator": {"id": group.creator.id, "username": group.creator.username},
        "members": [{"id": m.id, "username": m.username} for m in group.members],
    }

# Get all groups
@group_bp.route("/groups", methods=["GET"])
def get_groups():
    groups = Group.query.options(joinedload(Group.members)).all()
    return jsonify([serialize_group(g) for g in groups])

# Get single group
@group_bp.route("/groups/<int:group_id>", methods=["GET"])
def get_group(group_id):
    group = Group.query.options(joinedload(Group.members)).get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404
    return jsonify(serialize_group(group))

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

    # Add creator as member with role 'owner'
    group.members.append(creator)
    group_member = db.session.execute(
        text("UPDATE group_members SET role='owner' WHERE group_id=:gid AND user_id=:uid"),
        {"gid": group.id, "uid": creator.id}
    )
    db.session.commit()

    return jsonify(serialize_group(group)), 201

# Update group
@group_bp.route("/groups/<int:group_id>", methods=["PUT"])
def update_group(group_id):
    group = Group.query.options(joinedload(Group.members)).get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    data = request.json
    current_user_id = data.get("current_user_id")
    current_user_role = data.get("current_user_role", "")

    # Only owner or admin
    if group.creator_id != current_user_id and current_user_role != "admin":
        return jsonify({"error": "Permission denied"}), 403

    group.name = data.get("name", group.name)
    group.description = data.get("description", group.description)
    db.session.commit()

    return jsonify(serialize_group(group))

# Delete group
@group_bp.route("/groups/<int:group_id>", methods=["DELETE"])
def delete_group(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    data = request.json or {}
    current_user_id = data.get("current_user_id")
    current_user_role = data.get("current_user_role", "")

    if group.creator_id != current_user_id and current_user_role != "admin":
        return jsonify({"error": "Permission denied"}), 403

    db.session.delete(group)
    db.session.commit()
    return jsonify({"message": f"Group '{group.name}' deleted successfully"})

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

    if user not in group.members:
        group.members.append(user)
        db.session.execute(
            text("UPDATE group_members SET role=:role WHERE group_id=:gid AND user_id=:uid"),
            {"role": role, "gid": group_id, "uid": user_id}
        )
        db.session.commit()

    return jsonify({"message": f"User {user.username} added to group {group.name} as {role}"})