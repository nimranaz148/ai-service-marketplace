import uuid
import json
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.db.models import Provider, ProviderSlot
from app.agents.tools.provider_tools import find_providers
from app.agents.tools.booking_tools import create_booking
from app.agents.tools.notification_tools import schedule_followups
from app.agents.orchestrator import orchestrator

router = APIRouter(prefix="/vapi", tags=["Vapi Voice Webhook"])
logger = logging.getLogger("vapi_webhook")


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def handle_vapi_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Vapi HTTP Webhook endpoint.
    Handles real-time WebRTC tool calls (find_providers, create_booking)
    and returns spoken-friendly text responses for the Vapi LLM to read aloud.
    """
    body: Dict[str, Any] = await request.json()
    logger.info(f"[Vapi Webhook] Incoming keys: {list(body.keys())}")

    message_data = body.get("message", {})
    tool_calls = message_data.get("toolCalls", [])

    if not tool_calls:
        logger.info("[Vapi Webhook] No toolCalls — event/status update, returning 200.")
        return {"status": "received"}

    results = []
    user_id = str(await orchestrator._resolve_user_id(db, None))

    for tool_call in tool_calls:
        call_id = tool_call.get("id")
        function_info = tool_call.get("function", {})
        func_name = function_info.get("name")
        raw_args = function_info.get("arguments", {})

        # Vapi sometimes sends arguments as a JSON string instead of a dict
        if isinstance(raw_args, str):
            try:
                args = json.loads(raw_args)
            except json.JSONDecodeError:
                args = {}
        else:
            args = raw_args or {}

        logger.info(f"[Vapi] Tool: '{func_name}' | CallID: {call_id} | Args: {args}")

        # ── find_providers ─────────────────────────────────────────────────
        if func_name == "find_providers":
            category = args.get("category", "AC Technician")
            location = args.get("location") or args.get("location_text") or "Karachi"

            try:
                providers, _ = await find_providers(category=category, location_text=location, db=db)
            except Exception as e:
                logger.error(f"[Vapi] find_providers error: {e}", exc_info=True)
                providers = []

            if providers:
                top_p = providers[0]
                spoken = (
                    f"Main ne {len(providers)} {category} providers dhundhe. "
                    f"Sabse behtareen hai {top_p['name']}, rating {top_p['rating']} stars, "
                    f"area {top_p['area']}. Kya main in ke saath booking confirm karun?"
                )
            else:
                spoken = (
                    f"Mujhe maafi chahiye, {location} mein abhi koi {category} available nahi hai. "
                    "Kisi doosre area ya service ke liye try karein."
                )

            # Vapi expects plain string in `result` — it reads it aloud
            results.append({"toolCallId": call_id, "result": spoken})

        # ── create_booking ─────────────────────────────────────────────────
        elif func_name == "create_booking":
            raw_provider = args.get("provider_id") or args.get("provider_name") or args.get("provider")
            raw_slot = args.get("slot_id")

            logger.info(f"[Vapi create_booking] Resolving provider: '{raw_provider}', slot: '{raw_slot}'")

            # 1. Resolve Provider by UUID or Name
            provider_obj = None
            if raw_provider:
                try:
                    p_uuid = uuid.UUID(str(raw_provider))
                    provider_obj = await db.get(Provider, p_uuid)
                except (ValueError, AttributeError):
                    pass

            if not provider_obj and raw_provider:
                clean_name = str(raw_provider).strip()
                stmt = select(Provider).where(Provider.name.ilike(f"%{clean_name}%"))
                res = await db.execute(stmt)
                provider_obj = res.scalars().first()

                if not provider_obj and " " in clean_name:
                    first_part = clean_name.split()[0]
                    stmt = select(Provider).where(Provider.name.ilike(f"%{first_part}%"))
                    res = await db.execute(stmt)
                    provider_obj = res.scalars().first()

            # If still not found, pick top provider
            if not provider_obj:
                res = await db.execute(select(Provider).order_by(Provider.rating.desc()))
                provider_obj = res.scalars().first()

            # 2. Resolve Slot
            slot_obj = None
            if raw_slot and provider_obj:
                try:
                    s_uuid = uuid.UUID(str(raw_slot))
                    slot_obj = await db.get(ProviderSlot, s_uuid)
                except (ValueError, AttributeError):
                    pass

            if not slot_obj and provider_obj:
                stmt = select(ProviderSlot).where(
                    ProviderSlot.provider_id == provider_obj.id,
                    ProviderSlot.is_booked == False
                ).order_by(ProviderSlot.slot_date, ProviderSlot.slot_time)
                res = await db.execute(stmt)
                slot_obj = res.scalars().first()

            if provider_obj and slot_obj:
                try:
                    booking_out, _ = await create_booking(
                        provider_id=str(provider_obj.id),
                        user_id=user_id,
                        slot_id=str(slot_obj.id),
                        db=db,
                    )
                    await schedule_followups(
                        booking_id=booking_out.booking_id,
                        user_id=user_id,
                        provider_name=booking_out.provider_name,
                        slot_time=booking_out.slot_time,
                        db=db,
                    )
                    await db.commit()
                    spoken = (
                        f"Aapki booking confirm ho gayi hai! {booking_out.provider_name} "
                        f"{booking_out.slot_time} ko aayenge. "
                        f"Aapka reference code hai: {booking_out.confirmation_code}. Shukriya!"
                    )
                    logger.info(f"[Vapi] Booking created: {booking_out.confirmation_code} for {booking_out.provider_name}")
                except Exception as e:
                    logger.error(f"[Vapi] create_booking error: {e}", exc_info=True)
                    spoken = "Maazi chahta hoon, booking save karne mein masla aaya. Dobara try karein."
            else:
                spoken = "Maaf kijiye ga, is provider ke paas koi free slot nahi mila. Kisi doosre provider ke liye poochein."

            results.append({"toolCallId": call_id, "result": spoken})

        # ── unknown tool ────────────────────────────────────────────────────
        else:
            logger.warning(f"[Vapi] Unknown tool: '{func_name}'")
            results.append({"toolCallId": call_id, "result": f"Tool '{func_name}' is not supported."})

    logger.info(f"[Vapi Webhook] Returning {len(results)} result(s)")
    return {"results": results}
