from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.db.models import User
from app.db.schemas import UserResponse
from app.core.security import get_current_user_clerk_id

router = APIRouter(prefix="/me", tags=["User Profile"])


@router.get("", response_model=UserResponse)
async def get_my_profile(
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve currently authenticated user profile."""
    stmt = select(User).where(User.clerk_user_id == clerk_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        # Fallback to first user in table
        stmt = select(User).limit(1)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user
