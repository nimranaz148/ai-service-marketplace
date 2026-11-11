from typing import List
from pydantic import BaseModel


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
