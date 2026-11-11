from datetime import datetime, date
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


# ==========================================
# User Schemas
# ==========================================
class UserBase(BaseModel):
    name: str
    phone: Optional[str] = None
    role: str = "customer"
    preferred_language: str = "roman_urdu"
    area: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_suspended: bool = False


class UserCreate(UserBase):
    clerk_user_id: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    preferred_language: Optional[str] = None
    area: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_suspended: Optional[bool] = None


class UserResponse(UserBase):
    id: UUID
    clerk_user_id: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AdminCustomerResponse(UserResponse):
    bookings_count: int = 0


# ==========================================
# Provider Slot Schemas
# ==========================================
class ProviderSlotBase(BaseModel):
    slot_date: date
    slot_time: str
    is_booked: bool = False


class ProviderSlotCreate(BaseModel):
    slot_date: date
    slot_time: str


class ProviderSlotResponse(ProviderSlotBase):
    id: UUID
    provider_id: UUID
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Provider Schemas
# ==========================================
class ProviderBase(BaseModel):
    name: str
    category: str
    area: str
    lat: float
    lng: float
    rating: float = 5.0
    jobs_completed: int = 0
    price_range: str = "$$"
    is_active: bool = True


class ProviderCreate(ProviderBase):
    pass


class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    area: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    rating: Optional[float] = None
    jobs_completed: Optional[int] = None
    price_range: Optional[str] = None
    is_active: Optional[bool] = None


class ProviderResponse(ProviderBase):
    id: UUID
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ProviderWithSlotsResponse(ProviderResponse):
    slots: List[ProviderSlotResponse] = []


# ==========================================
# Trace Log Schemas
# ==========================================
class TraceLogBase(BaseModel):
    step: int
    agent_name: str
    tool_used: Optional[str] = None
    input_payload: Optional[Dict[str, Any]] = None
    output_payload: Optional[Dict[str, Any]] = None
    output_summary: Optional[str] = None
    duration_ms: int = 0


class TraceLogResponse(TraceLogBase):
    id: UUID
    session_id: UUID
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Intent Result Schemas
# ==========================================
class IntentResultBase(BaseModel):
    service_type: str
    location_text: Optional[str] = None
    time_preference: Optional[str] = None
    urgency: str = "medium"
    extracted_payload: Optional[Dict[str, Any]] = None


class IntentResultResponse(IntentResultBase):
    id: UUID
    session_id: UUID
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Booking Schemas
# ==========================================
class BookingBase(BaseModel):
    provider_id: UUID
    user_id: UUID
    slot_id: Optional[UUID] = None
    status: str = "confirmed"


class BookingCreate(BookingBase):
    pass


class BookingResponse(BookingBase):
    id: UUID
    confirmation_code: str
    booked_at: Optional[datetime] = None
    provider: Optional[ProviderResponse] = None
    slot: Optional[ProviderSlotResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ProviderBookingResponse(BookingResponse):
    """A provider's own booking list — adds the customer's real contact
    details, which a provider legitimately needs and a stranger does not."""
    customer: Optional[UserResponse] = None


class ProviderBookingStatusUpdate(BaseModel):
    status: str = Field(..., description="One of: confirmed, en_route, arrived, completed, cancelled")


# ==========================================
# Session Schemas
# ==========================================
class SessionBase(BaseModel):
    raw_input: str
    detected_language: str = "roman_urdu"
    status: str = "in_progress"


class SessionCreate(BaseModel):
    raw_input: str
    user_id: Optional[UUID] = None


class SessionResponse(SessionBase):
    id: UUID
    user_id: Optional[UUID] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TurnResponse(BaseModel):
    role: str  # "user" | "agent"
    content: str
    created_at: Optional[str] = None


class SessionDetailResponse(SessionResponse):
    intent_result: Optional[IntentResultResponse] = None
    trace_logs: List[TraceLogResponse] = []
    turns: List[TurnResponse] = []
    area: Optional[str] = None


# ==========================================
# High-Level Service Request / Response
# ==========================================
class ServiceRequestInput(BaseModel):
    message: str = Field(..., description="Customer request in English, Urdu, or Roman Urdu (e.g. 'Mujhe kal subah G-13 mein AC technician chahiye')")
    user_id: Optional[str] = Field(None, description="Optional User ID or Clerk ID")
    area: Optional[str] = Field(None, description="Optional pre-filled area")


class ServiceRequestOutput(BaseModel):
    session_id: UUID
    status: str
    raw_input: str
    detected_language: str
    intent: Optional[IntentResultBase] = None
    selected_provider: Optional[ProviderResponse] = None
    booking: Optional[BookingResponse] = None
    spoken_summary: Optional[str] = None
    trace_logs: List[TraceLogResponse] = []


# ==========================================
# Conversational Agent (Phase 2) — real multi-turn contract
# ==========================================
class ConversationTurnInput(BaseModel):
    message: str = Field(..., description="The customer's next message in an already-started conversation")


class ConversationResponse(BaseModel):
    session_id: UUID
    status: str  # in_progress, needs_input, completed, failed
    awaiting_input: bool
    area: Optional[str] = None
    agent_message: Optional[str] = None
    current_agent: Optional[str] = None  # Concierge, Discovery, Booking, or Followup
    turns: List[TurnResponse] = []
    trace_logs: List[TraceLogResponse] = []


# ==========================================
# Notification Schemas
# ==========================================
class NotificationBase(BaseModel):
    booking_id: UUID
    user_id: UUID
    type: str = "reminder"
    message: str
    scheduled_at: datetime
    status: str = "scheduled"


class NotificationResponse(NotificationBase):
    id: UUID
    sent_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
