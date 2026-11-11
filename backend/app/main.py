import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import async_engine, Base
from app.db.seed import seed_database
from app.api.routes import (
    requests,
    traces,
    providers,
    bookings,
    admin,
    vapi,
    me,
    provider_me,
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for application startup and shutdown."""
    logger.info("🚀 Starting AI Service Marketplace Backend...")
    yield
    logger.info("🛑 Shutting down AI Service Marketplace Backend...")
    await async_engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multi-Agent AI Service Marketplace Backend API",
    lifespan=lifespan,
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
    }


# Include Routers
app.include_router(requests.router)
app.include_router(traces.router)
app.include_router(providers.router)
app.include_router(bookings.router)
app.include_router(admin.router)
app.include_router(vapi.router)
app.include_router(me.router)
app.include_router(provider_me.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
