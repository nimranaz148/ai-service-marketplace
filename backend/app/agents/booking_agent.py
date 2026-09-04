import logging
from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.outputs import BookingSimulationOutput
from app.agents.tools.booking_tools import create_booking
from app.agents.tools.trace_tools import write_trace_log

logger = logging.getLogger("booking_agent")


class BookingAgent:
    """Agent responsible for simulating service bookings, locking slots, and generating confirmation codes."""

    def __init__(self):
        self.name = "BookingAgent"

    async def run(
        self,
        provider_id: str,
        user_id: str,
        slot_id: str,
        session_id: str,
        step: int,
        db: AsyncSession,
    ) -> Tuple[BookingSimulationOutput, int]:
        logger.info(f"📝 [{self.name}] Creating booking for provider={provider_id}, slot={slot_id}")

        # 1. Execute function tool
        booking_out, duration_ms = await create_booking(
            provider_id=provider_id,
            user_id=user_id,
            slot_id=slot_id,
            db=db,
        )

        # 2. Record execution trace
        await write_trace_log(
            session_id=session_id,
            step=step,
            agent_name=self.name,
            tool_used="create_booking",
            input_payload={"provider_id": provider_id, "slot_id": slot_id, "user_id": user_id},
            output_payload=booking_out.model_dump(),
            output_summary=(
                f"Booking confirmed for {booking_out.provider_name} at {booking_out.slot_time}. "
                f"Confirmation Code: {booking_out.confirmation_code}"
            ),
            duration_ms=duration_ms,
            db=db,
        )

        return booking_out, duration_ms


booking_agent = BookingAgent()
