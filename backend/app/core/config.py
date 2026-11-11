import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Service Marketplace"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = ""
    PORT: int = 8000

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        "*",
    ]

    # Database (PostgreSQL / Supabase)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"

    @field_validator("DATABASE_URL", mode="before")
    def assemble_async_db_url(cls, v: Union[str, None]) -> str:
        if not v:
            return "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        if v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    @field_validator("SYNC_DATABASE_URL", mode="before")
    def assemble_sync_db_url(cls, v: Union[str, None]) -> str:
        if not v:
            return "postgresql://postgres:postgres@localhost:5432/postgres"
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        if v.startswith("postgresql+asyncpg://"):
            return v.replace("postgresql+asyncpg://", "postgresql://", 1)
        return v

    # LLM Settings
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_API_KEY: str = ""
    GEMINI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta/openai/"
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Celery & Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Auth (backend-issued JWT; Clerk keys kept for a future swap)
    JWT_SECRET: str = "dev-only-change-me-in-production-please-32b+"
    JWT_EXPIRE_MINUTES: int = 60 * 12
    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""

    # Voice (Vapi)
    VAPI_API_KEY: str = ""
    VAPI_WEBHOOK_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
