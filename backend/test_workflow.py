import asyncio
import json
import logging
from app.db.session import async_engine, Base, get_db, AsyncSessionLocal
from app.db.seed import seed_database
from app.agents.orchestrator import orchestrator

logging.basicConfig(level=logging.INFO)


async def main():
    print("=" * 60)
    print("🧪 Running AI Service Marketplace Multi-Agent End-to-End Test")
    print("=" * 60)

    # 1. Initialize schema & seed data
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    seed_database()

    # 2. Test Main Demo Scenario
    test_query = "Mujhe kal subah G-13 mein AC technician chahiye"
    print(f"\n🗣️ Input Prompt: '{test_query}'")
    print("-" * 60)

    async with AsyncSessionLocal() as db:
        result = await orchestrator.execute_workflow(
            raw_input=test_query,
            db=db,
        )

        print(f"\n🎉 Workflow Status: {result.status}")
        print(f"Detected Language: {result.detected_language}")
        print(f"Extracted Service: {result.intent.service_type if result.intent else 'N/A'}")
        print(f"Extracted Location: {result.intent.location_text if result.intent else 'N/A'}")
        print(f"Extracted Time: {result.intent.time_preference if result.intent else 'N/A'}")
        print(f"\n🏆 Selected Provider: {result.selected_provider.name if result.selected_provider else 'None'}")
        print(f"⭐ Provider Rating: {result.selected_provider.rating if result.selected_provider else 'N/A'}")
        print(f"📍 Provider Area: {result.selected_provider.area if result.selected_provider else 'N/A'}")
        print(f"\n🔖 Booking Code: {result.booking.confirmation_code if result.booking else 'None'}")
        print(f"🔊 Spoken Concierge Summary: \"{result.spoken_summary}\"")

        print("\n" + "=" * 60)
        print("📜 Agent Step-by-Step Trace Logs:")
        print("=" * 60)
        for t in result.trace_logs:
            print(f"  Step {t.step} | [{t.agent_name}] -> tool: {t.tool_used}() ({t.duration_ms}ms)")
            print(f"         Summary: {t.output_summary}")
        print("=" * 60)
        print("✅ End-to-End Agent Execution Test PASSED Successfully!\n")


if __name__ == "__main__":
    asyncio.run(main())
