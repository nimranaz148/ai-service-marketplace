import uuid
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import TraceLog


async def write_trace_log(
    session_id: str,
    step: int,
    agent_name: str,
    tool_used: str,
    input_payload: Optional[Dict[str, Any]],
    output_payload: Optional[Dict[str, Any]],
    output_summary: str,
    duration_ms: int,
    db: AsyncSession,
) -> TraceLog:
    """Records an agent execution step in trace_logs table for observability and admin review."""
    trace_entry = TraceLog(
        id=uuid.uuid4(),
        session_id=uuid.UUID(session_id),
        step=step,
        agent_name=agent_name,
        tool_used=tool_used,
        input_payload=input_payload,
        output_payload=output_payload,
        output_summary=output_summary,
        duration_ms=duration_ms,
    )
    db.add(trace_entry)
    await db.flush()
    return trace_entry
