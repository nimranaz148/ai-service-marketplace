import random
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.db.models import Booking, ProviderSlot, Provider, User
from app.db.schemas import BookingCreate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_manual_booking(
    payload: BookingCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a manual booking directly."""
    provider = await db.get(Provider, payload.provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    user = await db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    slot = None
    if payload.slot_id:
        slot = await db.get(ProviderSlot, payload.slot_id)
        if not slot or slot.is_booked:
            raise HTTPException(status_code=400, detail="Selected slot is unavailable")
        slot.is_booked = True

    conf_code = f"BK-{random.randint(1000, 9999)}"
    booking_id = uuid.uuid4()
    booking = Booking(
        id=booking_id,
        provider_id=payload.provider_id,
        user_id=payload.user_id,
        slot_id=payload.slot_id,
        status="confirmed",
        confirmation_code=conf_code,
    )
    db.add(booking)
    await db.commit()

    # Eagerly load relationships to avoid MissingGreenlet in async mode
    stmt = (
        select(Booking)
        .where(Booking.id == booking_id)
        .options(
            selectinload(Booking.provider),
            selectinload(Booking.slot),
        )
    )
    res = await db.execute(stmt)
    return res.scalar_one()


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking_details(
    booking_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get booking details by ID."""
    stmt = (
        select(Booking)
        .where(Booking.id == booking_id)
        .options(
            selectinload(Booking.provider),
            selectinload(Booking.slot),
        )
    )
    result = await db.execute(stmt)
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")

    return booking


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Cancel a booking and mark the slot as available again."""
    stmt = (
        select(Booking)
        .where(Booking.id == booking_id)
        .options(
            selectinload(Booking.provider),
            selectinload(Booking.slot),
        )
    )
    result = await db.execute(stmt)
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")

    booking.status = "cancelled"
    if booking.slot:
        booking.slot.is_booked = False

    await db.commit()
    return booking
