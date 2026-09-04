import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.db.models import Provider, ProviderSlot
from app.db.schemas import ProviderResponse, ProviderWithSlotsResponse

router = APIRouter(prefix="/providers", tags=["Providers"])


@router.get("", response_model=List[ProviderResponse])
async def list_providers(
    category: Optional[str] = Query(None, description="Filter by service category"),
    area: Optional[str] = Query(None, description="Filter by area (e.g. G-13, F-10)"),
    db: AsyncSession = Depends(get_db),
):
    """List service providers with optional category and area filters."""
    stmt = select(Provider).where(Provider.is_active == True)

    if category:
        stmt = stmt.where(Provider.category.ilike(f"%{category}%"))
    if area:
        stmt = stmt.where(Provider.area.ilike(f"%{area}%"))

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{provider_id}", response_model=ProviderWithSlotsResponse)
async def get_provider_details(
    provider_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve detailed provider profile including available availability slots."""
    stmt = (
        select(Provider)
        .where(Provider.id == provider_id)
        .options(selectinload(Provider.slots))
    )
    result = await db.execute(stmt)
    provider = result.scalar_one_or_none()

    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Provider {provider_id} not found",
        )

    # Filter unbooked slots
    unbooked_slots = [s for s in provider.slots if not s.is_booked]
    return ProviderWithSlotsResponse(
        id=provider.id,
        name=provider.name,
        category=provider.category,
        area=provider.area,
        lat=provider.lat,
        lng=provider.lng,
        rating=provider.rating,
        jobs_completed=provider.jobs_completed,
        price_range=provider.price_range,
        is_active=provider.is_active,
        created_at=provider.created_at,
        slots=unbooked_slots,
    )
