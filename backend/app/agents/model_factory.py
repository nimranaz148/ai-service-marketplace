"""Model factory — Gemini through the OpenAI-compatible endpoint.

Uses the Agents SDK's documented pattern for non-OpenAI providers:
an AsyncOpenAI client pointed at Gemini's base_url, wrapped in
OpenAIChatCompletionsModel. Tracing to OpenAI is disabled (no OpenAI key).
Falls back to OpenAI itself only if GEMINI_API_KEY is unset but OPENAI_API_KEY is set.
"""
from typing import Optional, Union

from agents import OpenAIChatCompletionsModel, set_tracing_disabled
from openai import AsyncOpenAI

from app.core.config import settings

set_tracing_disabled(True)

_model: Optional[OpenAIChatCompletionsModel] = None


def llm_configured() -> bool:
    return bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)


def get_model() -> Union[OpenAIChatCompletionsModel, str]:
    global _model
    if _model is None:
        if settings.GEMINI_API_KEY:
            client = AsyncOpenAI(api_key=settings.GEMINI_API_KEY, base_url=settings.GEMINI_BASE_URL)
            _model = OpenAIChatCompletionsModel(model=settings.GEMINI_MODEL, openai_client=client)
        else:
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY or "unset")
            _model = OpenAIChatCompletionsModel(model=settings.OPENAI_MODEL, openai_client=client)
    return _model
