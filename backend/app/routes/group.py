from flask import Blueprint, jsonify, request
from sqlalchemy import text
from app.models import db, Group, User

group_bp = Blueprint("group", __name__)

# Get all groups
@group_bp.route("/groups", methods=["GET"])
def get_groups():
    groups = Group.query.all()
    return jsonify([{"id": group.id,
                     "name": group.name,
                     "description": group.description,
                     "creator": {
                         "id": group.creator.id,
                         "username": group.creator.username
                     },
                     "members": [{
                        "id": member.id,
                        "username": member.username} for member in group.members]}
                    for group in groups])

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
        "creator": {
            "id": group.creator.id,
            "username": group.creator.username
        },
        "members": [{
            "id": m.id,
            "username": m.username} for m in group.members],
    })

# Update a group (owner or admin can update)
@group_bp.route("/groups/<int:group_id>", methods=["PUT"])
def update_group(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    data = request.json
    current_user_id = data.get("current_user_id")
    current_user_role = data.get("current_user_role", "user")

    # Only owner or admin can update
    if group.creator_id != current_user_id and current_user_role != "admin":
        return jsonify({"error": "Only the group owner or an admin can update settings"}), 403

    # Update fields
    group.name = data.get("name", group.name)
    group.description = data.get("description", group.description)
    db.session.commit()

    # Return full group including members
    return jsonify({
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "creator": {
            "id": group.creator.id,
            "username": group.creator.username
        },
        "members": [
            {"id": m.id, "username": m.username} for m in group.members
        ]
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
    group.members.append(creator)  # add creator as a member
    db.session.commit()

    # now update role in the junction table
    db.session.execute(
        text("UPDATE group_members SET role='owner' WHERE group_id=:gid AND user_id=:uid"),
        {"gid": group.id, "uid": creator.id}
    )
    db.session.commit()

    return jsonify({
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "creator": {"id": creator.id, "username": creator.username}
    }), 201

# -----------------------------
# DELETE group (owner or admin)
# -----------------------------
@group_bp.route("/groups/<int:group_id>", methods=["DELETE"])
def delete_group(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    # Expect current_user_id and current_user_role in request body
    data = request.json or {}
    current_user_id = data.get("current_user_id")
    current_user_role = data.get("current_user_role", "")

    if not current_user_id:
        return jsonify({"error": "User ID required"}), 400

    # Check permission: owner or admin
    if group.creator_id != current_user_id and current_user_role != "admin":
        return jsonify({"error": "Permission denied"}), 403

    # Delete group
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
    group.members.append(user)
    # Set role in association table
    db.session.execute(
        text("UPDATE group_members SET role=:role WHERE group_id=:gid AND user_id=:uid"),
        {"role": role, "gid": group_id, "uid": user_id}
    )
    db.session.commit()
    return jsonify({"message": f"User {user.username} added to group {group.name} as {role}"})