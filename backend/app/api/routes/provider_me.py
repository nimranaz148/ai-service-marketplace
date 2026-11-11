import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.db.models import Provider, ProviderSlot, Booking, User
from app.db.schemas import (
    ProviderResponse,
    ProviderWithSlotsResponse,
    ProviderUpdate,
    ProviderSlotResponse,
    ProviderSlotCreate,
    ProviderBookingResponse,
)

router = APIRouter(prefix="/me/provider", tags=["Provider Self-Service"])


async def resolve_current_provider(
    db: AsyncSession,
    user_id: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Provider:
    """Resolves the Provider row owned by the calling user.

    Real auth (Clerk) isn't wired up yet, so this accepts the same
    "explicit id, else demo fallback" shape the rest of the app already
    uses (see ConversationService._resolve_user_id) rather than inventing
    a second convention: a `user_id` query param (UUID or clerk_user_id),
    or — when neither is given — the seeded demo provider persona.
    """
    clerk_token: Optional[str] = None
    if authorization:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() == "bearer" and token:
            clerk_token = token

    candidate = user_id or clerk_token

    user: Optional[User] = None
    if candidate:
        try:
            user = await db.get(User, uuid.UUID(candidate))
        except ValueError:
            stmt = select(User).where(User.clerk_user_id == candidate)
            res = await db.execute(stmt)
            user = res.scalar_one_or_none()

    if not user:
        stmt = select(User).where(User.clerk_user_id == "user_demo_provider_1")
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No provider account found")

    stmt = (
        select(Provider)
        .where(Provider.user_id == user.id)
        .options(selectinload(Provider.slots))
    )
    res = await db.execute(stmt)
    provider = res.scalar_one_or_none()
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
