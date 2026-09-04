import random
import time
import uuid
from typing import Dict, Any, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.outputs import BookingSimulationOutput
from app.db.models import Booking, ProviderSlot, Provider, User


async def create_booking(
    provider_id: str,
    user_id: str,
    slot_id: str,
    db: AsyncSession,
) -> Tuple[BookingSimulationOutput, int]:
    """Creates a booking record, marks the chosen slot as booked, and returns (BookingSimulationOutput, duration_ms)."""
    start_time = time.perf_counter()

    provider = await db.get(Provider, uuid.UUID(provider_id))
    if not provider:
        raise ValueError(f"Provider {provider_id} not found.")

    slot = await db.get(ProviderSlot, uuid.UUID(slot_id))
    if not slot:
        raise ValueError(f"Slot {slot_id} not found.")

    # Mark slot as booked
    slot.is_booked = True

    # Generate unique confirmation code: BK-<4 random digits>
    conf_code = f"BK-{random.randint(1000, 9999)}"

    booking_id = uuid.uuid4()
    booking = Booking(
        id=booking_id,
        provider_id=provider.id,
        user_id=uuid.UUID(user_id),
        slot_id=slot.id,
        status="confirmed",
        confirmation_code=conf_code,
    )
    db.add(booking)
    await db.flush()

    output = BookingSimulationOutput(
        booking_id=str(booking.id),
        confirmation_code=conf_code,
        provider_id=str(provider.id),
        provider_name=provider.name,
        slot_date=str(slot.slot_date),
        slot_time=slot.slot_time,
        status="confirmed",
        user_message=f"Aapki booking successfully confirm ho chuki hai! Provider: {provider.name}, Time: {slot.slot_time} ({slot.slot_date}), Code: {conf_code}.",
    )

    duration_ms = int((time.perf_counter() - start_time) * 1000)
    return output, duration_ms
