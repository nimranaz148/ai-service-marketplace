from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.models import User
from app.db.schemas import UserResponse

router = APIRouter(prefix="/me", tags=["User Profile"])


@router.get("", response_model=UserResponse)
async def get_my_profile(user: User = Depends(get_current_user)):
    """The authenticated user's profile (from the verified JWT)."""
    return user
