"""
ConversationService — turn-based front door onto the multi-agent graph
(Concierge -> Discovery -> Booking -> Followup, see app/agents/registry.py).

Owns the multi-turn contract the API routes need: start a session, continue
it with the customer's next message, and always leave behind a real,
readable transcript (`Session.turns`) plus the SDK's own continuation state
(`Session.conversation_history`) so the next HTTP request can resume exactly
where the agent chain left off — including which agent in the chain was
last active (`Session.current_agent`), since a handoff can leave a
different agent "holding" the conversation than the one it started with.

When OPENAI_API_KEY isn't configured (local/demo without secrets), falls
back to a small deterministic multi-turn script instead of the real SDK —
same "no fabricated facts, real DB lookups" contract, just no LLM call.
"""
import datetime
import logging
import uuid
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.models import Session, User
from app.services.user_resolver import resolve_user_id

logger = logging.getLogger("conversation_service")

def _ensure_openai_key_configured() -> bool:
    """True when an LLM key (Gemini preferred, else OpenAI) is configured;
    the model itself is built by app.agents.model_factory."""
    from app.agents.model_factory import llm_configured

    return llm_configured()


def _now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


class ConversationService:
    async def start(
        self,
        db: AsyncSession,
        message: str,
        user_id: Optional[str] = None,
        area: Optional[str] = None,
    ) -> Session:
        resolved_user_id = await self._resolve_user_id(db, user_id)
        session_obj = Session(
            id=uuid.uuid4(),
            user_id=resolved_user_id,
            raw_input=message,
            detected_language="roman_urdu",
            status="in_progress",
            area=area,
            conversation_history=[],
            turns=[],
            started_at=datetime.datetime.now(datetime.timezone.utc),
        )
        db.add(session_obj)
        await db.flush()
        await self._run_turn(db, session_obj, message)
        return session_obj

    async def continue_turn(self, db: AsyncSession, session_id: uuid.UUID, message: str) -> Session:
        session_obj = await db.get(Session, session_id)
        if not session_obj:
            raise ValueError(f"Session {session_id} not found")
        if session_obj.status in ("completed", "failed"):
            raise ValueError(f"Session {session_id} is already {session_obj.status}; start a new request.")
        await self._run_turn(db, session_obj, message)
        return session_obj

    async def _run_turn(self, db: AsyncSession, session_obj: Session, message: str) -> None:
        turns: List[Dict[str, Any]] = list(session_obj.turns or [])
        turns.append({"role": "user", "content": message, "created_at": _now()})

        if _ensure_openai_key_configured():
            agent_message, done = await self._run_sdk_turn(db, session_obj, message)
        else:
            agent_message, done = await self._run_scripted_turn(db, session_obj, message, turns)

        turns.append({"role": "agent", "content": agent_message, "created_at": _now()})
        session_obj.turns = turns
        session_obj.status = "completed" if done else "needs_input"
        if done:
            session_obj.completed_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()

    # ------------------------------------------------------------------
    # Real path: OpenAI Agents SDK
    # ------------------------------------------------------------------
    async def _run_sdk_turn(self, db: AsyncSession, session_obj: Session, message: str) -> Tuple[str, bool]:
        from agents import Runner, ToolCallItem
        from app.agents.registry import AGENTS_BY_NAME, concierge_agent
        from app.agents.tools.concierge_tools import AgentTurnContext

        history: List[Dict[str, Any]] = list(session_obj.conversation_history or [])
        turn_input = history + [{"role": "user", "content": message}] if history else message

        # Resume with whichever agent the handoff chain left "holding" the
        # conversation last turn (a fresh session always starts at Concierge).
        starting_agent = AGENTS_BY_NAME.get(session_obj.current_agent or "", concierge_agent)

        # Next trace step continues after whatever this session already logged.
        next_step = (await self._max_trace_step(db, session_obj.id)) + 1
        ctx = AgentTurnContext(db=db, session_id=str(session_obj.id), user_id=str(session_obj.user_id), step=next_step)

        result = await Runner.run(starting_agent, turn_input, context=ctx)

        session_obj.conversation_history = result.to_input_list()
        session_obj.current_agent = result.last_agent.name
        agent_message = result.final_output if isinstance(result.final_output, str) else str(result.final_output)

        booked = any(
            isinstance(item, ToolCallItem) and item.tool_name == "create_booking_tool"
            for item in result.new_items
        )
        return agent_message, booked

    # ------------------------------------------------------------------
    # Fallback path: no API key configured — deterministic scripted turns.
    # ------------------------------------------------------------------
    async def _run_scripted_turn(
        self,
        db: AsyncSession,
        session_obj: Session,
        message: str,
        turns: List[Dict[str, Any]],
    ) -> Tuple[str, bool]:
        from app.agents.tools.concierge_tools import AgentTurnContext
        from app.agents.tools.provider_tools import find_providers
        from app.agents.tools.booking_tools import create_booking
        from app.agents.tools.notification_tools import schedule_followups
        from app.agents.tools.trace_tools import write_trace_log

        combined_text = " ".join([t["content"] for t in turns if t["role"] == "user"])
        category = self._detect_category(combined_text)
        area = session_obj.area or self._detect_area(combined_text)

        next_step = (await self._max_trace_step(db, session_obj.id)) + 1
        ctx = AgentTurnContext(db=db, session_id=str(session_obj.id), user_id=str(session_obj.user_id), step=next_step)

        if not category:
            session_obj.current_agent = "Concierge"
            return ("Konsi service chahiye — AC, plumbing, electrical, cleaning ya tuition?", False)

        if not area:
            session_obj.current_agent = "Concierge"
            return (f"{category} ke liye, aap kis area mein hain (e.g. G-13 Islamabad, Gulberg Lahore)?", False)

        session_obj.current_agent = "Discovery"
        session_obj.area = area
        providers, duration_ms = await find_providers(category=category, location_text=area, db=db)
        await write_trace_log(
            session_id=str(session_obj.id),
            step=ctx.next_step(),
            agent_name="Discovery",
            tool_used="find_providers",
            input_payload={"category": category, "area": area},
            output_payload={"providers": providers},
            output_summary=f"Found {len(providers)} provider(s) for '{category}' near '{area}'.",
            duration_ms=duration_ms,
            db=db,
        )

        if not providers:
            return (f"Maazrat, {area} mein abhi koi {category} dastyab nahi hai.", True)

        confirming = any(w in message.lower() for w in ["haan", "yes", "theek", "ok", "confirm", "book", "kar do"])
        if not confirming:
            top = providers[0]
            return (
                f"{top['name']} available hain ({category}, rating {top['rating']}, {top['price_range']}). "
                f"Confirm karein to book kar deta hoon.",
                False,
            )

        top = providers[0]
        if not top.get("slots"):
            return (f"Maazrat, {top['name']} ke paas abhi koi open slot nahi hai.", True)
        slot = top["slots"][0]

        session_obj.current_agent = "Booking"
        booking_out, duration_ms = await create_booking(
            provider_id=top["id"], user_id=str(session_obj.user_id), slot_id=slot["id"], db=db
        )
        await write_trace_log(
            session_id=str(session_obj.id),
            step=ctx.next_step(),
            agent_name="Booking",
            tool_used="create_booking",
            input_payload={"provider_id": top["id"], "slot_id": slot["id"]},
            output_payload=booking_out.model_dump(),
            output_summary=f"Booking confirmed with {booking_out.provider_name} ({booking_out.confirmation_code}).",
            duration_ms=duration_ms,
            db=db,
        )

        session_obj.current_agent = "Followup"
        followup_out, duration_ms = await schedule_followups(
            booking_id=booking_out.booking_id,
            user_id=str(session_obj.user_id),
            provider_name=booking_out.provider_name,
            slot_time=booking_out.slot_time,
            db=db,
        )
        await write_trace_log(
            session_id=str(session_obj.id),
            step=ctx.next_step(),
            agent_name="Followup",
            tool_used="schedule_followup",
            input_payload={"booking_id": booking_out.booking_id},
            output_payload=followup_out.model_dump(),
            output_summary="Follow-up notification scheduled.",
            duration_ms=duration_ms,
            db=db,
        )

        return (booking_out.user_message, True)

    @staticmethod
    def _detect_category(text: str) -> Optional[str]:
        t = text.lower()
        if any(w in t for w in ["ac ", "ac,", "ac.", "aircon", "ac technician", " ac"]):
            return "AC Technician"
        if any(w in t for w in ["plumb", "nal", "leak", "pani"]):
            return "Plumber"
        if any(w in t for w in ["electric", "bijli", "switch", "wiring"]):
            return "Electrician"
        if any(w in t for w in ["clean", "safai"]):
            return "Cleaner"
        if any(w in t for w in ["tutor", "parha", "teacher", "tuition"]):
            return "Tutor"
        return None

    @staticmethod
    def _detect_area(text: str) -> Optional[str]:
        from app.agents.tools.provider_tools import AREA_COORDINATES

        norm = text.upper()
        for key in AREA_COORDINATES:
            if key in norm:
                return key.title()
        return None

    async def _max_trace_step(self, db: AsyncSession, session_id: uuid.UUID) -> int:
        from sqlalchemy import select, func
        from app.db.models import TraceLog

        stmt = select(func.max(TraceLog.step)).where(TraceLog.session_id == session_id)
        result = await db.execute(stmt)
        return result.scalar() or 0

    async def _resolve_user_id(self, db: AsyncSession, user_id: Optional[str]) -> uuid.UUID:
        return await resolve_user_id(db, user_id)


conversation_service = ConversationService()
