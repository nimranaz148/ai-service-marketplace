import datetime
import time
import uuid
from typing import Tuple, List
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.outputs import FollowupScheduleOutput
from app.db.models import Notification, Booking


async def schedule_followups(
    booking_id: str,
    user_id: str,
    provider_name: str,
    slot_time: str,
    db: AsyncSession,
) -> Tuple[FollowupScheduleOutput, int]:
    """Schedules service reminder and post-service satisfaction check in notifications table.
    Returns (FollowupScheduleOutput, duration_ms).
    """
    start_time = time.perf_counter()

    now = datetime.datetime.now(datetime.timezone.utc)
    reminder_time = now + datetime.timedelta(hours=2)
    feedback_time = now + datetime.timedelta(hours=6)

    notifications = [
        Notification(
            id=uuid.uuid4(),
            booking_id=uuid.UUID(booking_id),
            user_id=uuid.UUID(user_id),
            type="reminder",
            message=f"Reminder: {provider_name} is scheduled to arrive today at {slot_time}.",
            scheduled_at=reminder_time,
            status="scheduled",
        ),
        Notification(
            id=uuid.uuid4(),
            booking_id=uuid.UUID(booking_id),
            user_id=uuid.UUID(user_id),
            type="completion_check",
            message=f"How was your service with {provider_name}? Please rate your experience.",
            scheduled_at=feedback_time,
            status="scheduled",
        ),
    ]

    db.add_all(notifications)
    await db.flush()

    output = FollowupScheduleOutput(
        reminders_scheduled=len(notifications),
        reminder_times=[reminder_time.isoformat(), feedback_time.isoformat()],
        status="scheduled",
    )

    duration_ms = int((time.perf_counter() - start_time) * 1000)
    return output, duration_ms
