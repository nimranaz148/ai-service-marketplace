import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.core.security import get_current_user
from app.db.models import Provider, ProviderSlot, Booking, User
from app.db.schemas import (
    ProviderResponse,
    ProviderWithSlotsResponse,
    ProviderUpdate,
    ProviderSlotResponse,
    ProviderSlotCreate,
    ProviderBookingResponse,
    ProviderBookingStatusUpdate,
)

VALID_BOOKING_STATUSES = {"confirmed", "en_route", "arrived", "completed", "cancelled"}

router = APIRouter(prefix="/me/provider", tags=["Provider Self-Service"])


async def resolve_current_provider(
    db: AsyncSession,
    user_id: Optional[str] = None,  # ignored: identity comes only from the verified token
    authorization: Optional[str] = None,
) -> Provider:
    """The Provider row owned by the authenticated provider user."""
    user = await get_current_user(authorization=authorization, db=db)
    if user.role != "provider":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requires role: provider")
    stmt = select(Provider).where(Provider.user_id == user.id).options(selectinload(Provider.slots))
    provider = (await db.execute(stmt)).scalar_one_or_none()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This account is not linked to a provider profile yet",
        )
    return provider


@router.get("", response_model=ProviderWithSlotsResponse)
async def get_my_provider_profile(
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """The logged-in provider's own profile, including their real slots."""
    return await resolve_current_provider(db, user_id, authorization)


@router.patch("", response_model=ProviderResponse)
async def update_my_provider_profile(
    payload: ProviderUpdate,
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """Update the logged-in provider's own service listing (name, category,
    area, price range, active status). A provider can only ever edit their
    own row — resolved server-side, never trusted from the request body."""
    provider = await resolve_current_provider(db, user_id, authorization)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(provider, field, value)
    await db.commit()
    await db.refresh(provider)
    return provider


@router.get("/bookings", response_model=List[ProviderBookingResponse])
async def list_my_bookings(
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """Real bookings against this provider — not a fake local list."""
    provider = await resolve_current_provider(db, user_id, authorization)
    stmt = (
        select(Booking)
        .where(Booking.provider_id == provider.id)
        .options(selectinload(Booking.slot), selectinload(Booking.user))
        .order_by(Booking.booked_at.desc())
    )
    res = await db.execute(stmt)
    bookings = res.scalars().all()
    out = []
    for b in bookings:
        item = ProviderBookingResponse.model_validate(b)
        item.customer = b.user
        out.append(item)
    return out


@router.patch("/bookings/{booking_id}", response_model=ProviderBookingResponse)
async def update_my_booking_status(
    booking_id: uuid.UUID,
    payload: ProviderBookingStatusUpdate,
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """Move a booking through the real field-service lifecycle
    (confirmed -> en_route -> arrived -> completed), or cancel it."""
    if payload.status not in VALID_BOOKING_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"status must be one of {sorted(VALID_BOOKING_STATUSES)}",
        )
    provider = await resolve_current_provider(db, user_id, authorization)
    booking = await db.get(Booking, booking_id, options=[selectinload(Booking.slot), selectinload(Booking.user)])
    if not booking or booking.provider_id != provider.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    booking.status = payload.status
    await db.commit()
    await db.refresh(booking)
    item = ProviderBookingResponse.model_validate(booking)
    item.customer = booking.user
    return item


@router.get("/slots", response_model=List[ProviderSlotResponse])
async def list_my_slots(
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    provider = await resolve_current_provider(db, user_id, authorization)
    return sorted(provider.slots, key=lambda s: (s.slot_date, s.slot_time))


@router.post("/slots", response_model=ProviderSlotResponse, status_code=status.HTTP_201_CREATED)
async def create_my_slot(
    payload: ProviderSlotCreate,
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    provider = await resolve_current_provider(db, user_id, authorization)
    slot = ProviderSlot(
        id=uuid.uuid4(),
        provider_id=provider.id,
        slot_date=payload.slot_date,
        slot_time=payload.slot_time,
        is_booked=False,
    )
    db.add(slot)
    await db.commit()
    await db.refresh(slot)
    return slot


@router.delete("/slots/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_slot(
    slot_id: uuid.UUID,
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    provider = await resolve_current_provider(db, user_id, authorization)
    slot = await db.get(ProviderSlot, slot_id)
    if not slot or slot.provider_id != provider.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
    if slot.is_booked:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cannot delete a booked slot")
    await db.delete(slot)
    await db.commit()
    return None
