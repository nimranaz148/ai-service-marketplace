import datetime
import uuid
import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models import Session, User, Provider, Booking, TraceLog
from app.db.schemas import ServiceRequestOutput, TraceLogResponse, BookingResponse, ProviderResponse, IntentResultBase
from app.agents.intent_agent import intent_agent
from app.agents.discovery_agent import discovery_agent
from app.agents.ranking_agent import ranking_agent
from app.agents.booking_agent import booking_agent
from app.agents.followup_agent import followup_agent

logger = logging.getLogger("orchestrator")


def _normalize_to_roman_urdu(text: str) -> str:
    """Ensures input is always stored and processed in clean Roman Urdu / Hinglish."""
    if not text:
        return text
    replacements = {
        "अल्लाह हाफ़िज़": "Allah Hafiz",
        "नहीं, बस": "Nahi, bas",
        "थैंक यू": "Thank you",
        "प्लंबर चाहिए": "plumber chahiye",
        "प्लंबर": "plumber",
        "एसी": "AC",
        "इलेक्ट्रीशियन": "electrician",
        "क्लीनर": "cleaner",
        "ट्यूटर": "tutor",
        "चाहिए": "chahiye",
        "बुकिंग": "booking",
        "कन्फर्म": "confirm",
        "कर दो": "kar do",
        "टाइमिंग": "timing",
        "बता देना": "bata dena",
        "हाँ": "haan",
        "शुक्रिया": "shukriya",
        "कराची": "Karachi",
        "लाहौर": "Lahore",
        "इस्लामाबाद": "Islamabad",
    }
    cleaned = text
    for hi, ro in replacements.items():
        cleaned = cleaned.replace(hi, ro)
    return cleaned.replace("।", ".")


class AgentOrchestrator:
    """Master Orchestrator coordinating all 5 subagents:
    IntentAgent -> DiscoveryAgent -> RankingAgent -> BookingAgent -> FollowupAgent.
    """

    async def execute_workflow(
        self,
        raw_input: str,
        db: AsyncSession,
        user_id: Optional[str] = None,
        area: Optional[str] = None,
    ) -> ServiceRequestOutput:
        # Normalize input to clean Hinglish / Roman Urdu
        raw_input = _normalize_to_roman_urdu(raw_input)

        # 1. Resolve or create default user if not provided
        resolved_user_id = await self._resolve_user_id(db, user_id)

        # 2. Initialize Session record
        session_id = uuid.uuid4()
        session_obj = Session(
            id=session_id,
            user_id=resolved_user_id,
            raw_input=raw_input,
            detected_language="roman_urdu",
            status="in_progress",
            started_at=datetime.datetime.now(datetime.timezone.utc),
        )
        db.add(session_obj)
        await db.flush()

        step_counter = 1

        try:
            # ==========================================
            # STEP 1: Intent Extraction Sub-Agent
            # ==========================================
            intent_out, _ = await intent_agent.run(
                raw_message=raw_input,
                session_id=str(session_id),
                step=step_counter,
                db=db,
            )
            step_counter += 1

            # Override location if explicitly provided in request
            target_location = area or intent_out.location_text or "G-13"

            # ==========================================
            # STEP 2: Provider Discovery Sub-Agent
            # ==========================================
            matching_providers, _ = await discovery_agent.run(
                category=intent_out.service_type,
                location=target_location,
                session_id=str(session_id),
                step=step_counter,
                db=db,
            )
            step_counter += 1

            if not matching_providers:
                session_obj.status = "failed"
                session_obj.completed_at = datetime.datetime.now(datetime.timezone.utc)
                await db.commit()
                
                # Fetch traces for response
                traces = await self._get_session_traces(db, session_id)
                return ServiceRequestOutput(
                    session_id=session_id,
                    status="no_providers_found",
                    raw_input=raw_input,
                    detected_language=intent_out.detected_language,
                    spoken_summary=f"Maazrat, {target_location} mein abhi koi {intent_out.service_type} dastyab nahi hai.",
                    trace_logs=traces,
                )

            # ==========================================
            # STEP 3: Provider Ranking Sub-Agent
            # ==========================================
            ranking_out, _ = await ranking_agent.run(
                providers_list=matching_providers,
                time_preference=intent_out.time_preference,
                session_id=str(session_id),
                step=step_counter,
                db=db,
            )
            step_counter += 1

            # Get top provider details & chosen slot
            top_provider_info = next(p for p in matching_providers if p["id"] == ranking_out.top_provider_id)
            if not top_provider_info.get("slots"):
                raise ValueError(f"No available slots for top provider {ranking_out.top_provider_name}")

            chosen_slot = top_provider_info["slots"][0]

            # ==========================================
            # STEP 4: Booking Simulation Sub-Agent
            # ==========================================
            booking_out, _ = await booking_agent.run(
                provider_id=ranking_out.top_provider_id,
                user_id=str(resolved_user_id),
                slot_id=chosen_slot["id"],
                session_id=str(session_id),
                step=step_counter,
                db=db,
            )
            step_counter += 1

            # ==========================================
            # STEP 5: Follow-up Scheduling Sub-Agent
            # ==========================================
            followup_out, _ = await followup_agent.run(
                booking_id=booking_out.booking_id,
                user_id=str(resolved_user_id),
                provider_name=booking_out.provider_name,
                slot_time=booking_out.slot_time,
                session_id=str(session_id),
                step=step_counter,
                db=db,
            )

            # Finalize Session in DB
            session_obj.status = "completed"
            session_obj.completed_at = datetime.datetime.now(datetime.timezone.utc)
            await db.commit()

            # Retrieve complete trace responses
            traces = await self._get_session_traces(db, session_id)

            # Construct Response
            return ServiceRequestOutput(
                session_id=session_id,
                status="completed",
                raw_input=raw_input,
                detected_language=intent_out.detected_language,
                intent=IntentResultBase(
                    service_type=intent_out.service_type,
                    location_text=intent_out.location_text,
                    time_preference=intent_out.time_preference,
                    urgency=intent_out.urgency,
                    extracted_payload=intent_out.model_dump(),
                ),
                selected_provider=ProviderResponse(
                    id=uuid.UUID(top_provider_info["id"]),
                    name=top_provider_info["name"],
                    category=top_provider_info["category"],
                    area=top_provider_info["area"],
                    lat=top_provider_info["lat"],
                    lng=top_provider_info["lng"],
                    rating=top_provider_info["rating"],
                    jobs_completed=top_provider_info["jobs_completed"],
                    price_range=top_provider_info["price_range"],
                    is_active=True,
                ),
                booking=BookingResponse(
                    id=uuid.UUID(booking_out.booking_id),
                    provider_id=uuid.UUID(booking_out.provider_id),
                    user_id=resolved_user_id,
                    slot_id=uuid.UUID(chosen_slot["id"]),
                    status="confirmed",
                    confirmation_code=booking_out.confirmation_code,
                    booked_at=datetime.datetime.now(datetime.timezone.utc),
                ),
                spoken_summary=booking_out.user_message,
                trace_logs=traces,
            )

        except Exception as e:
            logger.error(f"❌ Error during agent orchestration: {e}", exc_info=True)
            session_obj.status = "failed"
            session_obj.completed_at = datetime.datetime.now(datetime.timezone.utc)
            await db.commit()
            raise

    async def _get_session_traces(self, db: AsyncSession, session_id: uuid.UUID) -> List[TraceLogResponse]:
        stmt = select(TraceLog).where(TraceLog.session_id == session_id).order_by(TraceLog.step.asc())
        res = await db.execute(stmt)
        return [TraceLogResponse.model_validate(t) for t in res.scalars().all()]

    async def _resolve_user_id(self, db: AsyncSession, user_id: Optional[str]) -> uuid.UUID:
        if user_id:
            try:
                parsed_uuid = uuid.UUID(user_id)
                user = await db.get(User, parsed_uuid)
                if user:
                    return user.id
            except ValueError:
                stmt = select(User).where(User.clerk_user_id == user_id)
                res = await db.execute(stmt)
                user = res.scalar_one_or_none()
                if user:
                    return user.id

        stmt = select(User).limit(1)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()
        if user:
            return user.id

        new_user = User(
            name="Demo Customer",
            phone="+923001234567",
            role="customer",
            preferred_language="roman_urdu",
            area="G-13",
        )
        db.add(new_user)
        await db.flush()
        return new_user.id


orchestrator = AgentOrchestrator()
