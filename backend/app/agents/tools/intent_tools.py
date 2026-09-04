import time
from typing import Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.model_factory import model_factory
from app.agents.prompts import INTENT_SYSTEM_PROMPT
from app.agents.outputs import IntentExtractionOutput
from app.db.models import IntentResult, Session


async def extract_intent(
    raw_message: str,
    session_id: str,
    db: AsyncSession,
) -> Tuple[IntentExtractionOutput, int]:
    """Extracts service type, location, time, urgency, and language from customer input.
    Saves the extracted intent to intent_results table and returns (result, duration_ms).
    """
    start_time = time.perf_counter()

    intent_output: IntentExtractionOutput = await model_factory.generate_structured(
        system_prompt=INTENT_SYSTEM_PROMPT,
        user_message=raw_message,
        response_model=IntentExtractionOutput,
    )

    duration_ms = int((time.perf_counter() - start_time) * 1000)

    # Save to database
    intent_record = IntentResult(
        session_id=session_id,
        service_type=intent_output.service_type,
        location_text=intent_output.location_text,
        time_preference=intent_output.time_preference,
        urgency=intent_output.urgency,
        extracted_payload=intent_output.model_dump(),
    )
    db.add(intent_record)

    # Update session detected language
    session_obj = await db.get(Session, session_id)
    if session_obj:
        session_obj.detected_language = intent_output.detected_language

    await db.flush()

    return intent_output, duration_ms
