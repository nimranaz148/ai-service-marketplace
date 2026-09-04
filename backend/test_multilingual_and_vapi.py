import os
import sys
import asyncio

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import AsyncSessionLocal
from app.agents.orchestrator import orchestrator
from app.agents.tools.provider_tools import find_providers
from app.agents.tools.booking_tools import create_booking


async def test_multilingual():
    test_cases = [
        ("Urdu Script", "مجھے کل صبح جی-13 میں اے سی ٹیکنیشن چاہیے"),
        ("English Urgent", "I need a plumber in F-10 urgently because of a bathroom leak"),
        ("Roman Urdu Tutor", "Mujhe I-8 mein kal sham ke liye math ka tutor chahiye"),
    ]

    print("\n" + "=" * 70, flush=True)
    print("🌍 MULTI-LINGUAL AGENT EXTRACTION & BOOKING TESTS", flush=True)
    print("=" * 70, flush=True)

    for label, query in test_cases:
        print(f"\n🔹 Testing: [{label}] -> '{query}'", flush=True)
        async with AsyncSessionLocal() as db:
            result = await orchestrator.execute_workflow(raw_input=query, db=db)
            print(f"   ✓ Detected Lang: {result.detected_language}", flush=True)
            print(f"   ✓ Extracted: {result.intent.service_type} | Area: {result.intent.location_text} | Time: {result.intent.time_preference}", flush=True)
            print(f"   ✓ Provider: {result.selected_provider.name} ({result.selected_provider.rating}★)", flush=True)
            print(f"   ✓ Booking Code: {result.booking.confirmation_code}", flush=True)
            print(f"   ✓ Spoken: \"{result.spoken_summary}\"", flush=True)


async def test_vapi_simulation():
    print("\n" + "=" * 70, flush=True)
    print("🎙️ VAPI VOICE WEBHOOK SIMULATION TEST", flush=True)
    print("=" * 70, flush=True)

    async with AsyncSessionLocal() as db:
        # 1. Voice tool call: find_providers
        print("1. Simulating Vapi Tool Call: `find_providers(category='AC Technician', location='G-13')`", flush=True)
        providers, duration = await find_providers("AC Technician", "G-13", db=db)
        print(f"   ✓ Found {len(providers)} matching providers in {duration}ms", flush=True)
        top_p = providers[0]
        print(f"   ✓ Top Provider: {top_p['name']} ({top_p['rating']}★, {top_p['distance_km']}km away)", flush=True)

        # 2. Voice tool call: create_booking
        print("\n2. Simulating Vapi Tool Call: `create_booking(provider_id='...', slot_id='...')`", flush=True)
        slot_id = top_p["slots"][0]["id"]
        booking_out, b_duration = await create_booking(
            provider_id=top_p["id"],
            user_id="11111111-1111-1111-1111-111111111111",
            slot_id=slot_id,
            db=db,
        )
        await db.commit()
        print(f"   ✓ Booking Confirmed in {b_duration}ms!", flush=True)
        print(f"   ✓ Ref Code: {booking_out.confirmation_code}", flush=True)
        print(f"   ✓ Spoken Output for Vapi LLM: \"{booking_out.user_message}\"", flush=True)

    print("\n" + "=" * 70, flush=True)
    print("✅ All Multilingual & Vapi Voice Simulation Tests PASSED!", flush=True)
    print("=" * 70 + "\n", flush=True)


async def main():
    await test_multilingual()
    await test_vapi_simulation()


if __name__ == "__main__":
    asyncio.run(main())
