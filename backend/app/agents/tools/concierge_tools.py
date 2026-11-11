"""
Real function tools for the Concierge agent (OpenAI Agents SDK).

Each tool wraps the existing DB-backed implementation (provider_tools /
booking_tools / notification_tools) and additionally writes a TraceLog row,
so every tool call the agent makes is visible in trace_logs — the same
table the /foundations agent-activity primitives already render from.
"""
import json
import logging
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from agents import RunContextWrapper, function_tool

from app.agents.tools.provider_tools import find_providers as _find_providers
from app.agents.tools.booking_tools import create_booking as _create_booking
from app.agents.tools.notification_tools import schedule_followups as _schedule_followups
from app.agents.tools.trace_tools import write_trace_log

logger = logging.getLogger("concierge_tools")


@dataclass
class ConciergeContext:
    """Per-turn context handed to every tool call via RunContextWrapper."""

    db: AsyncSession
    session_id: str
    user_id: str
    step: int = 1

    def next_step(self) -> int:
        current = self.step
        self.step += 1
        return current


async def _log(ctx: ConciergeContext, tool_used: str, input_payload: Dict[str, Any], output_payload: Any, summary: str, duration_ms: int = 0) -> None:
    try:
        await write_trace_log(
            session_id=ctx.session_id,
            step=ctx.next_step(),
            agent_name="Concierge",
            tool_used=tool_used,
            input_payload=input_payload,
            output_payload=output_payload if isinstance(output_payload, (dict, list)) else {"value": output_payload},
            output_summary=summary,
            duration_ms=duration_ms,
            db=ctx.db,
        )
    except Exception:
        logger.exception("Failed to write trace log for tool %s", tool_used)


@function_tool
async def find_providers_tool(ctx: RunContextWrapper[ConciergeContext], category: str, area: str) -> str:
    """Find verified, active providers matching a service category near an area.

    Args:
        category: the service category, e.g. "AC Technician", "Plumber", "Electrician", "Cleaner", "Tutor".
        area: the customer's neighborhood/city, e.g. "G-13, Islamabad" or "Gulberg, Lahore".
    """
    providers, duration_ms = await _find_providers(category=category, location_text=area, db=ctx.context.db)
    summary = (
        f"Found {len(providers)} provider(s) for '{category}' near '{area}'."
        if providers
        else f"No active providers found for '{category}' near '{area}'."
    )
    await _log(
        ctx.context,
        tool_used="find_providers",
        input_payload={"category": category, "area": area},
        output_payload={"providers": providers},
        summary=summary,
        duration_ms=duration_ms,
    )
    if not providers:
        return json.dumps({"providers": []})
    # Trim to what the model needs to reason about and read aloud — real fields only.
    trimmed = [
        {
            "id": p["id"],
            "name": p["name"],
            "category": p["category"],
            "area": p["area"],
            "rating": p["rating"],
            "jobs_completed": p["jobs_completed"],
            "price_range": p["price_range"],
            "distance_km": p["distance_km"],
            "available_slots": p["slots"],
        }
        for p in providers[:5]
    ]
    return json.dumps({"providers": trimmed})


@function_tool
async def create_booking_tool(ctx: RunContextWrapper[ConciergeContext], provider_id: str, slot_id: str) -> str:
    """Confirm a booking for the customer with a specific provider and time slot.
    Only call this after the customer has explicitly agreed to a provider and a slot.

    Args:
        provider_id: the provider's id, from a previous find_providers_tool result.
        slot_id: the chosen slot's id, from that provider's available_slots.
    """
    output, duration_ms = await _create_booking(
        provider_id=provider_id,
        user_id=ctx.context.user_id,
        slot_id=slot_id,
        db=ctx.context.db,
    )
    await _log(
        ctx.context,
        tool_used="create_booking",
        input_payload={"provider_id": provider_id, "slot_id": slot_id},
        output_payload=output.model_dump(),
        summary=f"Booking confirmed with {output.provider_name} ({output.confirmation_code}).",
        duration_ms=duration_ms,
    )
    return output.model_dump_json()


@function_tool
async def schedule_followup_tool(ctx: RunContextWrapper[ConciergeContext], booking_id: str, provider_name: str, slot_time: str) -> str:
    """Schedule a post-service follow-up notification for a confirmed booking.

    Args:
        booking_id: the confirmed booking's id.
        provider_name: the provider's name, for the follow-up message.
        slot_time: the booked slot's time, for the follow-up message.
    """
    output, duration_ms = await _schedule_followups(
        booking_id=booking_id,
        user_id=ctx.context.user_id,
        provider_name=provider_name,
        slot_time=slot_time,
        db=ctx.context.db,
    )
    await _log(
        ctx.context,
        tool_used="schedule_followup",
        input_payload={"booking_id": booking_id, "provider_name": provider_name, "slot_time": slot_time},
        output_payload=output.model_dump() if hasattr(output, "model_dump") else {"value": str(output)},
        summary="Follow-up notification scheduled.",
        duration_ms=duration_ms,
    )
    return output.model_dump_json() if hasattr(output, "model_dump_json") else json.dumps({"value": str(output)})
