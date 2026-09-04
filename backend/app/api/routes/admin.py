import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.db.models import Provider, Booking, Session, TraceLog, User, ProviderSlot
from app.db.schemas import (
    ProviderResponse,
    ProviderCreate,
    ProviderUpdate,
    BookingResponse,
    SessionDetailResponse,
    TraceLogResponse,
)

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """Overview metrics for the admin dashboard."""
    total_sessions = await db.scalar(select(func.count(Session.id)))
    total_bookings = await db.scalar(select(func.count(Booking.id)))
    active_providers = await db.scalar(select(func.count(Provider.id)).where(Provider.is_active == True))
    total_traces = await db.scalar(select(func.count(TraceLog.id)))

    # Recent 5 sessions
    stmt = (
        select(Session)
        .order_by(desc(Session.started_at))
        .limit(5)
        .options(selectinload(Session.intent_result))
    )
    res = await db.execute(stmt)
    recent_sessions = res.scalars().all()

    return {
        "total_sessions": total_sessions or 0,
        "total_bookings": total_bookings or 0,
        "active_providers": active_providers or 0,
        "total_trace_logs": total_traces or 0,
        "recent_sessions": [
            {
                "id": str(s.id),
                "raw_input": s.raw_input,
                "detected_language": s.detected_language,
                "status": s.status,
                "service_type": s.intent_result.service_type if s.intent_result else "Unknown",
                "started_at": s.started_at.isoformat() if s.started_at else None,
            }
            for s in recent_sessions
        ],
    }


@router.get("/sessions", response_model=List[SessionDetailResponse])
async def list_admin_sessions(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve full sessions list with attached intent results and trace logs."""
    stmt = (
        select(Session)
        .order_by(desc(Session.started_at))
        .limit(limit)
        .options(
            selectinload(Session.intent_result),
            selectinload(Session.trace_logs),
        )
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/traces", response_model=List[TraceLogResponse])
async def list_admin_traces(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve recent agent trace logs across all sessions."""
    stmt = (
        select(TraceLog)
        .order_by(desc(TraceLog.created_at))
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/bookings", response_model=List[BookingResponse])
async def list_admin_bookings(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all marketplace bookings with provider and slot details."""
    stmt = (
        select(Booking)
        .order_by(desc(Booking.booked_at))
        .limit(limit)
        .options(
            selectinload(Booking.provider),
            selectinload(Booking.slot),
        )
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/providers", response_model=List[ProviderResponse])
async def list_admin_providers(
    db: AsyncSession = Depends(get_db),
):
    """List all providers (active & inactive) for admin management."""
    stmt = select(Provider).order_by(desc(Provider.created_at))
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/providers", response_model=ProviderResponse, status_code=status.HTTP_201_CREATED)
async def create_admin_provider(
    payload: ProviderCreate,
    db: AsyncSession = Depends(get_db),
):
    """Add a new service provider."""
    provider = Provider(
        name=payload.name,
        category=payload.category,
        area=payload.area,
        lat=payload.lat,
        lng=payload.lng,
        rating=payload.rating,
        jobs_completed=payload.jobs_completed,
        price_range=payload.price_range,
        is_active=payload.is_active,
    )
    db.add(provider)
    await db.commit()
    await db.refresh(provider)
    return provider


@router.patch("/providers/{provider_id}", response_model=ProviderResponse)
async def update_admin_provider(
    provider_id: uuid.UUID,
    payload: ProviderUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update existing provider details."""
    provider = await db.get(Provider, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(provider, field, value)

    await db.commit()
    await db.refresh(provider)
    return provider
