import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.db.models import Session
from app.db.schemas import (
    ServiceRequestInput,
    ServiceRequestOutput,
    SessionDetailResponse,
)
from app.agents.orchestrator import orchestrator

router = APIRouter(prefix="/requests", tags=["Service Requests & Agents"])


@router.post("", response_model=ServiceRequestOutput, status_code=status.HTTP_200_OK)
async def create_service_request(
    payload: ServiceRequestInput,
    db: AsyncSession = Depends(get_db),
):
    """Start full multi-agent workflow:
    Input (Urdu/Roman Urdu/English) -> Intent -> Discovery -> Ranking -> Booking -> Followup -> Traces.
    """
    try:
        result = await orchestrator.execute_workflow(
            raw_input=payload.message,
            db=db,
            user_id=payload.user_id,
            area=payload.area,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent workflow error: {str(e)}",
        )


@router.get("/{session_id}", response_model=SessionDetailResponse)
async def get_session_details(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Fetch request/session result with intent output and trace logs."""
    stmt = (
        select(Session)
        .where(Session.id == session_id)
        .options(
            selectinload(Session.intent_result),
            selectinload(Session.trace_logs),
        )
    )
    result = await db.execute(stmt)
    session_obj = result.scalar_one_or_none()

    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found",
        )

    return session_obj
