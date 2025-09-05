from flask import Blueprint, request, jsonify
from sqlalchemy.orm import joinedload
from app.models import db, Event, Group, GroupMembers
from datetime import datetime

event_bp = Blueprint("event", __name__)

# ---------------------------
# Helpers
# ---------------------------
def serialize_event(event):
    group_admins = [
        m.id for m in event.group.members
        if any(r.role == "admin" for r in db.session.query(GroupMembers).filter_by(user_id=m.id, group_id=event.group_id))
    ]
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "start_time": event.start_time.isoformat() if event.start_time else None,
        "end_time": event.end_time.isoformat() if event.end_time else None,
        "creator_id": event.creator_id,
        "creator_username": event.creator.username,
        "group_id": event.group_id,
        "visibility": event.visibility,
        "group_admins": group_admins
    }

def is_event_editable_by_user(event, user_id, user_role):
    if user_role == "admin":  # site admin
        return True
    if event.creator_id == user_id:  # event creator
        return True
    if event.group.creator_id == user_id:  # group owner
        return True
    # check group admins
    admins = [
        m.id for m in event.group.members
        if any(r.role == "admin" for r in db.session.query(GroupMembers).filter_by(user_id=m.id, group_id=event.group_id))
    ]
    if user_id in admins:
        return True
    return False

# ---------------------------
# CRUD Events
# ---------------------------
@event_bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = Event.query.options(joinedload(Event.group).joinedload(Group.members)).get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(serialize_event(event))

@event_bp.route("/groups/<int:group_id>/events", methods=["GET"])
def get_group_events(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    events = Event.query.filter_by(group_id=group_id).all()
    return jsonify([serialize_event(e) for e in events])

@event_bp.route("/events", methods=["POST"])
def create_event():
    data = request.json
    group = Group.query.get(data.get("group_id"))
    if not group:
        return jsonify({"error": "Group not found"}), 404
    if group.creator_id != data.get("creator_id"):
        return jsonify({"error": "Only group owner can create events"}), 403

    event = Event(
        title=data.get("title"),
        description=data.get("description"),
        creator_id=data.get("creator_id"),
        group_id=group.id,
        start_time=datetime.fromisoformat(data["start_time"]) if data.get("start_time") else None,
        end_time=datetime.fromisoformat(data["end_time"]) if data.get("end_time") else None,
        visibility=data.get("visibility", "public")
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(serialize_event(event)), 201

@event_bp.route("/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    event = Event.query.options(joinedload(Event.group).joinedload(Group.members)).get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    data = request.json
    if not is_event_editable_by_user(event, data.get("current_user_id"), data.get("current_user_role", "")):
        return jsonify({"error": "Permission denied"}), 403

    event.title = data.get("title", event.title)
    event.description = data.get("description", event.description)
    event.visibility = data.get("visibility", event.visibility)
    if data.get("start_time"):
        event.start_time = datetime.fromisoformat(data["start_time"])
    if data.get("end_time"):
        event.end_time = datetime.fromisoformat(data["end_time"])

    db.session.commit()
    return jsonify(serialize_event(event))

@event_bp.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    event = Event.query.options(joinedload(Event.group).joinedload(Group.members)).get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    data = request.json or {}
    if not is_event_editable_by_user(event, data.get("current_user_id"), data.get("current_user_role", "")):
        return jsonify({"error": "Permission denied"}), 403

    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": f"Event '{event.title}' deleted successfully"})