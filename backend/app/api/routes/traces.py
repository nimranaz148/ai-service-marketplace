import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.db.models import TraceLog, Session
from app.db.schemas import TraceLogResponse

router = APIRouter(prefix="/requests", tags=["Agent Traces"])


@router.get("/{session_id}/trace", response_model=List[TraceLogResponse])
async def get_session_traces(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all chronological agent step trace logs for a given session."""
    stmt = (
        select(TraceLog)
        .where(TraceLog.session_id == session_id)
        .order_by(TraceLog.step.asc())
    )
    result = await db.execute(stmt)
    traces = result.scalars().all()

    if not traces:
        # Check if session exists
        session_obj = await db.get(Session, session_id)
        if not session_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session {session_id} not found",
            )

    return traces


@router.get("/{session_id}/trace/export")
async def export_session_trace_json(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Export trace data as raw formatted JSON for admin debugging or audit."""
    session_obj = await db.get(Session, session_id)
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found",
        )

    stmt = (
        select(TraceLog)
        .where(TraceLog.session_id == session_id)
        .order_by(TraceLog.step.asc())
    )
    result = await db.execute(stmt)
    traces = result.scalars().all()

    return {
        "session_id": str(session_obj.id),
        "raw_input": session_obj.raw_input,
        "detected_language": session_obj.detected_language,
        "status": session_obj.status,
        "started_at": session_obj.started_at.isoformat() if session_obj.started_at else None,
        "completed_at": session_obj.completed_at.isoformat() if session_obj.completed_at else None,
        "total_steps": len(traces),
        "steps": [
            {
                "step": t.step,
                "agent": t.agent_name,
                "tool": t.tool_used,
                "duration_ms": t.duration_ms,
                "summary": t.output_summary,
                "input": t.input_payload,
                "output": t.output_payload,
                "timestamp": t.created_at.isoformat() if t.created_at else None,
            }
            for t in traces
        ],
    }
