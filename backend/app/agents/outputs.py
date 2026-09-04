from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class IntentExtractionOutput(BaseModel):
    service_type: str = Field(..., description="Service category, e.g., 'AC Technician', 'Plumber', 'Electrician', 'Cleaner', 'Tutor'")
    location_text: str = Field(..., description="Location or area mentioned, e.g., 'G-13', 'F-10', 'Islamabad'")
    time_preference: str = Field(..., description="Time or date preference, e.g., 'Tomorrow Morning', 'Today 2 PM'")
    urgency: str = Field(default="medium", description="'low', 'medium', 'high', 'emergency'")
    detected_language: str = Field(default="roman_urdu", description="'roman_urdu', 'urdu', 'english'")
    confidence_score: float = Field(default=0.95, description="Confidence score between 0.0 and 1.0")


class RankedProviderItem(BaseModel):
    provider_id: str
    provider_name: str
    category: str
    area: str
    rating: float
    distance_km: float
    has_available_slot: bool
    rating_score: float
    proximity_score: float
    availability_score: float
    total_score: float
    reasoning: str


class RankingOutput(BaseModel):
    ranked_providers: List[RankedProviderItem]
    top_provider_id: str
    top_provider_name: str
    selection_reason: str


class BookingSimulationOutput(BaseModel):
    booking_id: str
    confirmation_code: str
    provider_id: str
    provider_name: str
    slot_time: str
    slot_date: str
    status: str
    user_message: str


class FollowupScheduleOutput(BaseModel):
    reminders_scheduled: int
    reminder_times: List[str]
    status: str
