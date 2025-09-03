from flask import Blueprint, jsonify, request
from app.models import db, Event, User, Hobby, Group
from datetime import datetime

event_bp = Blueprint("event", __name__)


# Get all events
@event_bp.route("/events", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify([{
        "id": e.id,
        "title": e.title,
        "description": e.description,
        "group_id": e.group_id,
        "creator_id": e.creator_id
    } for e in events])

# Get single event by id
@event_bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    return jsonify({
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "start_time": event.start_time.isoformat() if event.start_time else None,
        "end_time": event.end_time.isoformat() if event.end_time else None,
        "creator_id": event.creator_id,
        "creator_username": event.creator.username,
        "group_id": event.group_id,
        "visibility": event.visibility
    })

# Get events for a group
@event_bp.route("/groups/<int:group_id>/events", methods=["GET"])
def get_group_events(group_id):
    events = Event.query.filter_by(group_id=group_id).all()
    return jsonify([
        {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "start_time": e.start_time,
            "end_time": e.end_time,
            "creator_id": e.creator_id,
            "visibility": e.visibility,
        }
        for e in events
    ])

# Create event
@event_bp.route("/events", methods=["POST"])
def create_event():
    data = request.json
    title = data.get("title")
    creator_id = data.get("creator_id")
    group_id = data.get("group_id")
    visibility = data.get("visibility", "public")

    start_time_str = data.get("start_time")
    end_time_str = data.get("end_time")

    start_time = datetime.fromisoformat(start_time_str) if start_time_str else None
    end_time = datetime.fromisoformat(end_time_str) if end_time_str else None

    event = Event(
        title=title,
        description=data.get("description"),
        creator_id=creator_id,
        group_id=group_id,
        start_time=start_time,
        end_time=end_time,
        visibility=visibility
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"id": event.id, "title": event.title}), 201


# Add attendee
@event_bp.route("/events/<int:event_id>/attendees", methods=["POST"])
def add_event_attendee(event_id):
    data = request.json
    user_id = data.get("user_id")
    status = data.get("status", "going")
    event = Event.query.get(event_id)
    user = User.query.get(user_id)
    if not event or not user:
        return jsonify({"error": "Event or User not found"}), 404
    event.attendees.append(user)
    db.session.execute(
        "UPDATE event_attendees SET status=:status WHERE event_id=:eid AND user_id=:uid",
        {"status": status, "eid": event_id, "uid": user_id}
    )
    db.session.commit()
    return jsonify({"message": f"User {user.username} marked as {status} for event {event.title}"})