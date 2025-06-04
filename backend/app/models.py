from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import func
import uuid
from .db import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Principle(db.Model):
    __tablename__ = "principles"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    embedding = db.Column(db.ARRAY(db.Float), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    deleted = db.Column(db.Boolean, default=False)

    user = db.relationship("User", backref="principles")
