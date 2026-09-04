import logging
from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.outputs import IntentExtractionOutput
from app.agents.tools.intent_tools import extract_intent
from app.agents.tools.trace_tools import write_trace_log

logger = logging.getLogger("intent_agent")


class IntentAgent:
    """Agent responsible for understanding customer service intent across English, Urdu, and Roman Urdu."""

    def __init__(self):
        self.name = "IntentAgent"

    async def run(
        self,
        raw_message: str,
        session_id: str,
        step: int,
        db: AsyncSession,
    ) -> Tuple[IntentExtractionOutput, int]:
        logger.info(f"🧠 [{self.name}] Processing message: '{raw_message}'")

        # 1. Execute function tool
        intent_output, duration_ms = await extract_intent(
            raw_message=raw_message,
            session_id=session_id,
            db=db,
        )

        # 2. Record execution trace
        await write_trace_log(
            session_id=session_id,
            step=step,
            agent_name=self.name,
            tool_used="extract_intent",
            input_payload={"raw_message": raw_message},
            output_payload=intent_output.model_dump(),
            output_summary=(
                f"Extracted {intent_output.service_type} for {intent_output.location_text} "
                f"at {intent_output.time_preference} (Language: {intent_output.detected_language})"
            ),
            duration_ms=duration_ms,
            db=db,
        )

        return intent_output, duration_ms


intent_agent = IntentAgent()
