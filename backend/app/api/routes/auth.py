from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, get_current_user, hash_password, verify_password
from app.db.models import Provider, User
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginInput(BaseModel):
    email: str
    password: str
    role: Optional[str] = None  # if given, the account must belong to this portal's role


class SignupInput(BaseModel):
    name: str = Field(min_length=2)
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(min_length=8)
    role: str = "customer"  # customer | provider (admins are seeded only)
    phone: Optional[str] = None
    area: Optional[str] = None
    category: Optional[str] = None


# City-centre coordinates used until a provider/customer sets a precise location.
_CITY_CENTRES = {
    "karachi": (24.8607, 67.0011),
    "lahore": (31.5204, 74.3587),
    "islamabad": (33.6844, 73.0479),
    "rawalpindi": (33.5651, 73.0169),
}


def _centre_for(area: Optional[str]) -> tuple:
    text = (area or "").lower()
    for city, coords in _CITY_CENTRES.items():
        if city in text:
            return coords
    return _CITY_CENTRES["islamabad"]


def _user_json(u: User) -> dict:
    return {"id": str(u.id), "name": u.name, "email": u.email, "role": u.role, "phone": u.phone, "area": u.area}


@router.post("/login")
async def login(payload: LoginInput, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == payload.email.strip().lower()))
    user = res.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if user.is_suspended:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account suspended")
    if payload.role and payload.role != user.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This is a {user.role} account — use the {user.role} portal to sign in.",
        )
    return {"access_token": create_access_token(user), "token_type": "bearer", "user": _user_json(user)}


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupInput, db: AsyncSession = Depends(get_db)):
    if payload.role not in ("customer", "provider"):
        raise HTTPException(status_code=400, detail="Role must be customer or provider")
    email = payload.email.strip().lower()
    exists = await db.execute(select(User).where(User.email == email))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    lat, lng = _centre_for(payload.area)
    user = User(
        name=payload.name, email=email, password_hash=hash_password(payload.password),
        role=payload.role, phone=payload.phone, area=payload.area, lat=lat, lng=lng,
    )
    db.add(user)
    await db.flush()
    if payload.role == "provider":
        db.add(Provider(
            user_id=user.id, name=payload.name, category=payload.category or "General",
            area=payload.area or "Islamabad", lat=lat, lng=lng, rating=5.0, jobs_completed=0, price_range="PKR 1500", is_active=True,
        ))
    await db.commit()
    return {"access_token": create_access_token(user), "token_type": "bearer", "user": _user_json(user)}


@router.get("/me")
async def auth_me(user: User = Depends(get_current_user)):
    return _user_json(user)
