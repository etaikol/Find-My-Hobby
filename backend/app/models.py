from . import db
from datetime import datetime

# Users
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(255), nullable=False, default="user")


    hobbies = db.relationship("Hobby", secondary="user_hobbies", back_populates="users")
    groups = db.relationship("Group", secondary="group_members", back_populates="members")
    events_created = db.relationship("Event", backref="creator", lazy=True)

# Hobbies
class Hobby(db.Model):
    __tablename__ = "hobbies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    users = db.relationship("User", secondary="user_hobbies", back_populates="hobbies")
    events = db.relationship("Event", secondary="event_hobbies", back_populates="hobbies")

# Groups
class Group(db.Model):
    __tablename__ = "groups"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    members = db.relationship("User", secondary="group_members", back_populates="groups")
    creator = db.relationship("User", backref="created_groups", foreign_keys=[creator_id])  # ✅

# Events
class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"))
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    visibility = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    attendees = db.relationship("User", secondary="event_attendees", backref="events_attending")
    hobbies = db.relationship("Hobby", secondary="event_hobbies", back_populates="events")

# Junction Tables
class UserHobbies(db.Model):
    __tablename__ = "user_hobbies"
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    hobby_id = db.Column(db.Integer, db.ForeignKey("hobbies.id"), primary_key=True)

class GroupMembers(db.Model):
    __tablename__ = "group_members"
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"), primary_key=True)
    role = db.Column(db.String(50))
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

class EventAttendees(db.Model):
    __tablename__ = "event_attendees"
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    status = db.Column(db.String(50))

class EventHobbies(db.Model):
    __tablename__ = "event_hobbies"
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), primary_key=True)
    hobby_id = db.Column(db.Integer, db.ForeignKey("hobbies.id"), primary_key=True)
