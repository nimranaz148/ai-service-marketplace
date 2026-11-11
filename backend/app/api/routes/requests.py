import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.db.models import Session
from app.db.schemas import (
    ServiceRequestInput,
    ConversationTurnInput,
    ConversationResponse,
    SessionDetailResponse,
)
from app.services.conversation import conversation_service

router = APIRouter(prefix="/requests", tags=["Service Requests & Agents"])


async def _to_conversation_response(db: AsyncSession, session_obj: Session) -> ConversationResponse:
    await db.refresh(session_obj, attribute_names=["trace_logs"])
    turns = session_obj.turns or []
    agent_message = turns[-1]["content"] if turns and turns[-1]["role"] == "agent" else None
    return ConversationResponse(
        session_id=session_obj.id,
        status=session_obj.status,
        awaiting_input=session_obj.status == "needs_input",
        area=session_obj.area,
        agent_message=agent_message,
        turns=turns,
        trace_logs=sorted(session_obj.trace_logs, key=lambda t: t.step),
    )


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_200_OK)
async def create_service_request(
    payload: ServiceRequestInput,
    db: AsyncSession = Depends(get_db),
):
    """Start a real multi-turn conversation with the Concierge agent.
    The first turn may already ask a follow-up question (status: needs_input)
    instead of completing in one shot — that's expected, not an error.
    """
    try:
        session_obj = await conversation_service.start(
            db=db,
            message=payload.message,
            user_id=payload.user_id,
            area=payload.area,
        )
        return await _to_conversation_response(db, session_obj)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent workflow error: {str(e)}",
        )


@router.post("/{session_id}/reply", response_model=ConversationResponse, status_code=status.HTTP_200_OK)
async def continue_service_request(
    session_id: uuid.UUID,
    payload: ConversationTurnInput,
    db: AsyncSession = Depends(get_db),
):
    """Continue an in-progress conversation with the customer's next message."""
    try:
        session_obj = await conversation_service.continue_turn(db=db, session_id=session_id, message=payload.message)
        return await _to_conversation_response(db, session_obj)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
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
    """Fetch a session's full transcript, trace logs, and status."""
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
