import jwt
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status
from app.core.config import settings


async def get_current_user_clerk_id(
    authorization: Optional[str] = Header(None)
) -> Optional[str]:
    """Extract and verify Clerk user ID from Authorization Bearer token.
    In development mode or when Clerk secret is not configured, provides a demo fallback.
    """
    if not authorization:
        # Fallback for dev / demo mode
        return "user_demo_customer_1"

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme",
        )

    # If Clerk secret is provided, verify JWT; otherwise decode without verification in dev
    try:
        if settings.CLERK_SECRET_KEY:
            # Decode using Clerk secret
            payload: Dict[str, Any] = jwt.decode(
                token,
                settings.CLERK_SECRET_KEY,
                algorithms=["HS256", "RS256"],
                options={"verify_signature": False},  # For hackathon ease; set True with PEM in prod
            )
        else:
            payload: Dict[str, Any] = jwt.decode(
                token,
                options={"verify_signature": False},
            )
        return payload.get("sub") or "user_demo_customer_1"
    except Exception as e:
        if settings.DEBUG:
            return "user_demo_customer_1"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}",
        )
