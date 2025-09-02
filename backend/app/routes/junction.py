from flask import Blueprint, request, jsonify
from app.models import db, User, Hobby, Group, Event
from sqlalchemy import text

junction_bp = Blueprint("junction", __name__)

# -------------------------
# User <-> Hobby
# -------------------------
@junction_bp.route("/users/<int:user_id>/hobbies", methods=["GET"])
def get_user_hobbies(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify([{"id": h.id, "name": h.name} for h in user.hobbies])

@junction_bp.route("/users/<int:user_id>/hobbies", methods=["POST"])
def add_user_hobby(user_id):
    data = request.json
    hobby_id = data.get("hobby_id")
    user = User.query.get(user_id)
    hobby = Hobby.query.get(hobby_id)
    if not user or not hobby:
        return jsonify({"error": "User or Hobby not found"}), 404

    if hobby not in user.hobbies:
        user.hobbies.append(hobby)
        db.session.commit()
    return jsonify({"message": f"Hobby '{hobby.name}' added to user '{user.username}'"})


# -------------------------
# Group <-> User
# -------------------------
@junction_bp.route("/groups/<int:group_id>/members", methods=["POST"])
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
    return jsonify({"message": f"User '{user.username}' added to group '{group.name}' as '{role}'"})


# -------------------------
# Event <-> User (Attendees)
# -------------------------
@junction_bp.route("/events/<int:event_id>/attendees", methods=["POST"])
def add_event_attendee(event_id):
    data = request.json
    user_id = data.get("user_id")
    status = data.get("status", "going")
    event = Event.query.get(event_id)
    user = User.query.get(user_id)
    if not event or not user:
        return jsonify({"error": "Event or User not found"}), 404

    if user not in event.attendees:
        event.attendees.append(user)
        db.session.execute(
            text("UPDATE event_attendees SET status=:status WHERE event_id=:eid AND user_id=:uid"),
            {"status": status, "eid": event_id, "uid": user_id}
        )
        db.session.commit()
    return jsonify({"message": f"User '{user.username}' marked as '{status}' for event '{event.title}'"})


# -------------------------
# Event <-> Hobby
# -------------------------
@junction_bp.route("/events/<int:event_id>/hobbies", methods=["POST"])
def add_event_hobby(event_id):
    data = request.json
    hobby_id = data.get("hobby_id")
    event = Event.query.get(event_id)
    hobby = Hobby.query.get(hobby_id)
    if not event or not hobby:
        return jsonify({"error": "Event or Hobby not found"}), 404

    if hobby not in event.hobbies:
        event.hobbies.append(hobby)
        db.session.commit()
    return jsonify({"message": f"Hobby '{hobby.name}' added to event '{event.title}'"})
