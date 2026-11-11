"""Shared "resolve who's calling" helper.

Real per-role auth isn't wired up yet, so every entry point that needs a
user (the conversational agent, the Vapi voice webhook) resolves the same
way: an explicit id (UUID or Clerk id) if given, else the first user in the
table, else a freshly created demo customer. One implementation, not one
per caller.
"""
import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import User


async def resolve_user_id(db: AsyncSession, user_id: Optional[str]) -> uuid.UUID:
    if user_id:
        try:
            parsed_uuid = uuid.UUID(user_id)
            user = await db.get(User, parsed_uuid)
            if user:
                return user.id
        except ValueError:
            stmt = select(User).where(User.clerk_user_id == user_id)
            res = await db.execute(stmt)
            user = res.scalar_one_or_none()
            if user:
                return user.id

    stmt = select(User).limit(1)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if user:
        return user.id

    new_user = User(
        name="Demo Customer",
        phone="+923001234567",
        role="customer",
        preferred_language="roman_urdu",
        area="G-13",
    )
    db.add(new_user)
    await db.flush()
    return new_user.id
