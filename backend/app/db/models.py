import uuid
from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.types import TypeDecorator, CHAR, JSON
from sqlalchemy.orm import relationship

from app.db.session import Base


# Universal UUID Type that works on both SQLite and Postgres
class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type if available, otherwise CHAR(36).
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID())
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(str(value)))
            else:
                return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(str(value))
            return value


class User(Base):
    __tablename__ = "users"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    clerk_user_id = Column(String(255), unique=True, nullable=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default="customer")  # "customer", "admin"
    preferred_language = Column(String(50), default="roman_urdu")  # "roman_urdu", "urdu", "english"
    area = Column(String(255), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    is_suspended = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    provider_profile = relationship("Provider", back_populates="owner", uselist=False)


class Provider(Base):
    __tablename__ = "providers"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, unique=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)  # AC Technician, Plumber, Electrician, etc.
    area = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    rating = Column(Float, default=5.0)
    jobs_completed = Column(Integer, default=0)
    price_range = Column(String(50), default="$$")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    slots = relationship("ProviderSlot", back_populates="provider", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="provider")
    owner = relationship("User", back_populates="provider_profile")


class ProviderSlot(Base):
    __tablename__ = "provider_slots"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    provider_id = Column(GUID, ForeignKey("providers.id", ondelete="CASCADE"), nullable=False)
    slot_date = Column(Date, nullable=False)
    slot_time = Column(String(50), nullable=False)  # "10:00 AM", "02:00 PM"
    is_booked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    provider = relationship("Provider", back_populates="slots")
    booking = relationship("Booking", back_populates="slot", uselist=False)


class Session(Base):
    __tablename__ = "sessions"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    raw_input = Column(Text, nullable=False)
    detected_language = Column(String(50), default="roman_urdu")
    status = Column(String(50), default="in_progress")  # in_progress, needs_input, completed, failed
    area = Column(String(255), nullable=True)
    # SDK-format input item list (agents.Runner continuity) — opaque JSON, never read by the frontend.
    conversation_history = Column(JSON, nullable=True)
    # UI-facing transcript: [{role: "user"|"agent", content, created_at}, ...]
    turns = Column(JSON, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="sessions")
    intent_result = relationship("IntentResult", back_populates="session", uselist=False, cascade="all, delete-orphan")
    trace_logs = relationship("TraceLog", back_populates="session", cascade="all, delete-orphan", order_by="TraceLog.step")


class IntentResult(Base):
    __tablename__ = "intent_results"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    session_id = Column(GUID, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, unique=True)
    service_type = Column(String(100), nullable=False)
    location_text = Column(String(255), nullable=True)
    time_preference = Column(String(100), nullable=True)
    urgency = Column(String(50), default="medium")  # low, medium, high, emergency
    extracted_payload = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session = relationship("Session", back_populates="intent_result")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    provider_id = Column(GUID, ForeignKey("providers.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    slot_id = Column(GUID, ForeignKey("provider_slots.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="confirmed")  # confirmed, in_progress, completed, cancelled
    confirmation_code = Column(String(50), unique=True, nullable=False)
    booked_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    provider = relationship("Provider", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
    slot = relationship("ProviderSlot", back_populates="booking")
    notifications = relationship("Notification", back_populates="booking", cascade="all, delete-orphan")


class TraceLog(Base):
    __tablename__ = "trace_logs"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    session_id = Column(GUID, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    step = Column(Integer, nullable=False)
    agent_name = Column(String(100), nullable=False)
    tool_used = Column(String(100), nullable=True)
    input_payload = Column(JSON, nullable=True)
    output_payload = Column(JSON, nullable=True)
    output_summary = Column(Text, nullable=True)
    duration_ms = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session = relationship("Session", back_populates="trace_logs")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    booking_id = Column(GUID, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), default="reminder")  # reminder, completion_check, arrival_alert
    message = Column(Text, nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="scheduled")  # scheduled, sent, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    booking = relationship("Booking", back_populates="notifications")
    user = relationship("User", back_populates="notifications")
