import json
import logging
from typing import Optional, Dict, Any, Type, TypeVar
from pydantic import BaseModel
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger("model_factory")
T = TypeVar("T", bound=BaseModel)


class ModelFactory:
    """Manages primary LLM client (OpenAI) and fallback LLM client (Gemini via OpenAI-compatible endpoint)."""

    def __init__(self):
        # Primary OpenAI client
        self.openai_client = None
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your-openai-api-key":
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        # Fallback Gemini client (OpenAI-compatible)
        self.gemini_client = None
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key":
            self.gemini_client = AsyncOpenAI(
                api_key=settings.GEMINI_API_KEY,
                base_url=settings.GEMINI_BASE_URL,
            )

    async def generate_structured(
        self,
        system_prompt: str,
        user_message: str,
        response_model: Type[T],
        temperature: float = 0.1,
    ) -> T:
        """Calls primary LLM (OpenAI) with structured output format.
        Falls back to Gemini if OpenAI fails or API key is missing.
        """
        # Try OpenAI First
        if self.openai_client:
            try:
                response = await self.openai_client.beta.chat.completions.parse(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    response_format=response_model,
                    temperature=temperature,
                )
                parsed = response.choices[0].message.parsed
                if parsed:
                    return parsed
            except Exception as e:
                logger.warning(f"⚠️ OpenAI primary model failed: {e}. Attempting fallback to Gemini...")

        # Fallback to Gemini
        if self.gemini_client:
            try:
                # Gemini OpenAI endpoint json_object mode
                prompt_with_schema = (
                    f"{system_prompt}\n\n"
                    f"You MUST respond ONLY with valid JSON matching this schema:\n"
                    f"{json.dumps(response_model.model_json_schema())}"
                )
                response = await self.gemini_client.chat.completions.create(
                    model=settings.GEMINI_MODEL,
                    messages=[
                        {"role": "system", "content": prompt_with_schema},
                        {"role": "user", "content": user_message},
                    ],
                    response_format={"type": "json_object"},
                    temperature=temperature,
                )
                content = response.choices[0].message.content
                if content:
                    data = json.loads(content)
                    return response_model.model_validate(data)
            except Exception as e:
                logger.error(f"❌ Gemini fallback model also failed: {e}")

        # Deterministic Mock Fallback for local demo if no API keys are provided
        logger.info("ℹ️ Using heuristic rule-based extractor (Mock Fallback mode)")
        return self._heuristic_fallback(user_message, response_model)

    def _heuristic_fallback(self, user_message: str, response_model: Type[T]) -> T:
        """Safe heuristic extractor when API keys are not yet configured in local environment."""
        msg_lower = user_message.lower()

        # Service detection
        service = "AC Technician"
        if "plumber" in msg_lower or "nal" in msg_lower or "leak" in msg_lower:
            service = "Plumber"
        elif "electric" in msg_lower or "bijli" in msg_lower or "switch" in msg_lower:
            service = "Electrician"
        elif "clean" in msg_lower or "safai" in msg_lower:
            service = "Cleaner"
        elif "tutor" in msg_lower or "parha" in msg_lower or "teacher" in msg_lower:
            service = "Tutor"

        # Area detection across Islamabad, Karachi, and Lahore
        area = "G-13, Islamabad"
        area_mappings = {
            "gulshan": "Gulshan-e-Iqbal, Karachi",
            "clifton": "Clifton, Karachi",
            "pechs": "PECHS, Karachi",
            "karachi": "Karachi",
            "dha lahore": "DHA Phase 5, Lahore",
            "gulberg": "Gulberg, Lahore",
            "model town": "Model Town, Lahore",
            "johar town": "Johar Town, Lahore",
            "lahore": "Lahore",
            "g-13": "Sector G-13, Islamabad",
            "g-11": "Sector G-11, Islamabad",
            "f-10": "Sector F-10, Islamabad",
            "f-11": "Sector F-11, Islamabad",
            "i-8": "Sector I-8, Islamabad",
            "blue area": "Blue Area, Islamabad",
            "bahria": "Bahria Town, Islamabad",
            "islamabad": "Islamabad",
            "dha": "DHA Phase 5",
        }
        for k, v in area_mappings.items():
            if k in msg_lower:
                area = v
                break

        # Time detection
        time_pref = "Tomorrow Morning (10:00 AM)"
        if "aaj" in msg_lower or "today" in msg_lower:
            time_pref = "Today Afternoon (02:00 PM)"
        elif "parso" in msg_lower:
            time_pref = "Day After Tomorrow (11:00 AM)"

        # Language detection
        lang = "roman_urdu"
        if any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in user_message):
            lang = "urdu"
        elif all(ord(char) < 128 for char in user_message) and any(w in msg_lower for w in ["need", "want", "require", "looking for"]):
            lang = "english"

        from app.agents.outputs import IntentExtractionOutput
        if response_model == IntentExtractionOutput:
            return IntentExtractionOutput(
                service_type=service,
                location_text=area,
                time_preference=time_pref,
                urgency="high" if any(u in msg_lower for u in ["emergency", "urgent", "jaldi", "fauran", "short circuit", "leak"]) else "medium",
                detected_language=lang,
                confidence_score=0.98,
            )

        raise ValueError(f"No mock fallback defined for {response_model}")


model_factory = ModelFactory()
