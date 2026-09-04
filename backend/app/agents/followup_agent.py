import logging
from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.outputs import FollowupScheduleOutput
from app.agents.tools.notification_tools import schedule_followups
from app.agents.tools.trace_tools import write_trace_log

logger = logging.getLogger("followup_agent")


class FollowupAgent:
    """Agent responsible for scheduling service reminders and post-service satisfaction checks."""

    def __init__(self):
        self.name = "FollowupAgent"

    async def run(
        self,
        booking_id: str,
        user_id: str,
        provider_name: str,
        slot_time: str,
        session_id: str,
        step: int,
        db: AsyncSession,
    ) -> Tuple[FollowupScheduleOutput, int]:
        logger.info(f"⏰ [{self.name}] Scheduling reminders for booking={booking_id}")

        # 1. Execute function tool
        followup_out, duration_ms = await schedule_followups(
            booking_id=booking_id,
            user_id=user_id,
            provider_name=provider_name,
            slot_time=slot_time,
            db=db,
        )

        # 2. Record execution trace
        await write_trace_log(
            session_id=session_id,
            step=step,
            agent_name=self.name,
            tool_used="schedule_followups",
            input_payload={"booking_id": booking_id, "slot_time": slot_time},
            output_payload=followup_out.model_dump(),
            output_summary=f"Scheduled {followup_out.reminders_scheduled} reminder & completion notifications.",
            duration_ms=duration_ms,
            db=db,
        )

        return followup_out, duration_ms


followup_agent = FollowupAgent()
