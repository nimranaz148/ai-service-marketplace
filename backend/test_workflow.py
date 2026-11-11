import asyncio
import logging
from app.db.session import async_engine, Base, AsyncSessionLocal
from app.db.seed import seed_database
from app.services.conversation import conversation_service

logging.basicConfig(level=logging.INFO)


async def main():
    print("=" * 60)
    print("Testing the real Concierge agent end-to-end (multi-turn)")
    print("=" * 60)

    # 1. Initialize schema & seed data
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    seed_database()

    async with AsyncSessionLocal() as db:
        print("\nTurn 1: 'Mujhe kal subah G-13 mein AC technician chahiye'")
        session = await conversation_service.start(db, "Mujhe kal subah G-13 mein AC technician chahiye")
        print(f"  status: {session.status}")
        print(f"  agent:  {session.turns[-1]['content']}")

        if session.status == "needs_input":
            print("\nTurn 2 (confirm): 'haan theek hai, book kar do'")
            session = await conversation_service.continue_turn(db, session.id, "haan theek hai, book kar do")
            print(f"  status: {session.status}")
            print(f"  agent:  {session.turns[-1]['content']}")

        print("\n" + "=" * 60)
        print("Trace log (every real tool call the agent made):")
        print("=" * 60)
        from sqlalchemy import select
        from app.db.models import TraceLog

        res = await db.execute(select(TraceLog).where(TraceLog.session_id == session.id).order_by(TraceLog.step))
        for t in res.scalars().all():
            print(f"  step {t.step} | [{t.agent_name}] -> tool: {t.tool_used}() ({t.duration_ms}ms)")
            print(f"         {t.output_summary}")

        assert session.status == "completed", "expected the conversation to complete after confirming"
        print("\n✅ End-to-end conversational agent test PASSED.\n")


if __name__ == "__main__":
    asyncio.run(main())
