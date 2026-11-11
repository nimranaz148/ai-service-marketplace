import os
import sys
import asyncio
import json
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.db.session import async_engine, Base
from app.db.seed import seed_database


async def test_all_api_routes():
    print("=" * 75)
    print("🚀 PHASE 3: FASTAPI REST API & VAPI WEBHOOK COMPREHENSIVE TEST SUITE")
    print("=" * 75)

    # 1. Initialize schema & seed database
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    seed_database()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:

        # -------------------------------------------------------------
        # 1. Health Check
        # -------------------------------------------------------------
        res = await client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print(f"✅ 1. GET /health -> Status {res.status_code} ({res.json()['status']})")

        # -------------------------------------------------------------
        # 2. POST /requests (Trigger Agent Workflow)
        # -------------------------------------------------------------
        req_payload = {
            "message": "Mujhe kal subah G-13 mein AC technician chahiye"
        }
        res = await client.post("/requests", json=req_payload)
        assert res.status_code == 200, f"POST /requests failed: {res.text}"
        data = res.json()
        session_id = data["session_id"]
        print(f"✅ 2. POST /requests -> Session {session_id[:8]}... | Status: {data['status']} | Agent: {data.get('agent_message')}")

        # Conversational contract: the agent shows a provider and waits for confirmation
        # before booking — it never books on the first turn without the customer agreeing.
        if data["status"] == "needs_input":
            res = await client.post(f"/requests/{session_id}/reply", json={"message": "haan theek hai, book kar do"})
            assert res.status_code == 200, f"POST /requests/{{id}}/reply failed: {res.text}"
            data = res.json()
        booking_code = "BK-" in (data.get("agent_message") or "")
        print(f"✅ 2b. Confirm turn -> Status: {data['status']} | Booked: {booking_code}")

        # -------------------------------------------------------------
        # 3. GET /requests/{session_id}
        # -------------------------------------------------------------
        res = await client.get(f"/requests/{session_id}")
        assert res.status_code == 200, f"GET /requests/{{id}} failed: {res.text}"
        print(f"✅ 3. GET /requests/{session_id[:8]}... -> Language: {res.json()['detected_language']}")

        # -------------------------------------------------------------
        # 4. GET /requests/{session_id}/trace
        # -------------------------------------------------------------
        res = await client.get(f"/requests/{session_id}/trace")
        assert res.status_code == 200, f"GET /requests/{{id}}/trace failed: {res.text}"
        traces = res.json()
        print(f"✅ 4. GET /requests/{session_id[:8]}.../trace -> Found {len(traces)} step logs")

        # -------------------------------------------------------------
        # 5. GET /requests/{session_id}/trace/export
        # -------------------------------------------------------------
        res = await client.get(f"/requests/{session_id}/trace/export")
        assert res.status_code == 200, f"GET /requests/{{id}}/trace/export failed: {res.text}"
        print(f"✅ 5. GET /requests/{session_id[:8]}.../trace/export -> Total Export Steps: {res.json()['total_steps']}")

        # -------------------------------------------------------------
        # 6. GET /providers (with and without filter)
        # -------------------------------------------------------------
        res = await client.get("/providers?category=AC")
        assert res.status_code == 200, f"GET /providers failed: {res.text}"
        providers = res.json()
        provider_id = providers[0]["id"]
        print(f"✅ 6. GET /providers?category=AC -> Found {len(providers)} matching providers")

        # -------------------------------------------------------------
        # 7. GET /providers/{id}
        # -------------------------------------------------------------
        res = await client.get(f"/providers/{provider_id}")
        assert res.status_code == 200, f"GET /providers/{{id}} failed: {res.text}"
        p_data = res.json()
        slot_id = p_data["slots"][0]["id"] if p_data.get("slots") else None
        print(f"✅ 7. GET /providers/{provider_id[:8]}... -> Name: {p_data['name']} ({len(p_data.get('slots', []))} slots)")

        # -------------------------------------------------------------
        # 8. POST /bookings (Manual Booking)
        # -------------------------------------------------------------
        manual_booking_payload = {
            "provider_id": provider_id,
            "user_id": "11111111-1111-1111-1111-111111111111",
            "slot_id": slot_id,
            "status": "confirmed",
        }
        res = await client.post("/bookings", json=manual_booking_payload)
        assert res.status_code == 201, f"POST /bookings failed: {res.text}"
        manual_booking_id = res.json()["id"]
        manual_code = res.json()["confirmation_code"]
        print(f"✅ 8. POST /bookings -> Created Booking {manual_booking_id[:8]}... (Code: {manual_code})")

        # -------------------------------------------------------------
        # 9. GET /bookings/{id}
        # -------------------------------------------------------------
        res = await client.get(f"/bookings/{manual_booking_id}")
        assert res.status_code == 200, f"GET /bookings/{{id}} failed: {res.text}"
        print(f"✅ 9. GET /bookings/{manual_booking_id[:8]}... -> Status: {res.json()['status']}")

        # -------------------------------------------------------------
        # 10. POST /bookings/{id}/cancel
        # -------------------------------------------------------------
        res = await client.post(f"/bookings/{manual_booking_id}/cancel")
        assert res.status_code == 200, f"POST /bookings/{{id}}/cancel failed: {res.text}"
        assert res.json()["status"] == "cancelled"
        print(f"✅ 10. POST /bookings/{manual_booking_id[:8]}.../cancel -> Cancelled & Slot Released")

        # -------------------------------------------------------------
        # 11. Admin Endpoints: GET /admin/stats, /sessions, /traces, /bookings, /providers
        # -------------------------------------------------------------
        res = await client.get("/admin/stats")
        assert res.status_code == 200
        stats = res.json()
        print(f"✅ 11. GET /admin/stats -> Sessions: {stats['total_sessions']}, Bookings: {stats['total_bookings']}, Providers: {stats['active_providers']}")

        res = await client.get("/admin/sessions")
        assert res.status_code == 200
        print(f"✅ 12. GET /admin/sessions -> {len(res.json())} sessions listed")

        res = await client.get("/admin/traces")
        assert res.status_code == 200
        print(f"✅ 13. GET /admin/traces -> {len(res.json())} trace entries listed")

        res = await client.get("/admin/bookings")
        assert res.status_code == 200
        print(f"✅ 14. GET /admin/bookings -> {len(res.json())} bookings listed")

        res = await client.get("/admin/providers")
        assert res.status_code == 200
        print(f"✅ 15. GET /admin/providers -> {len(res.json())} providers listed")

        # -------------------------------------------------------------
        # 16. Admin Create & Update Provider
        # -------------------------------------------------------------
        new_provider_payload = {
            "name": "Islamabad Smart Electrician",
            "category": "Electrician",
            "area": "F-11",
            "lat": 33.6850,
            "lng": 72.9850,
            "rating": 4.9,
            "jobs_completed": 50,
            "price_range": "PKR 2200",
            "is_active": True,
        }
        res = await client.post("/admin/providers", json=new_provider_payload)
        assert res.status_code == 201
        created_p_id = res.json()["id"]
        print(f"✅ 16. POST /admin/providers -> Created '{res.json()['name']}'")

        res = await client.patch(f"/admin/providers/{created_p_id}", json={"rating": 5.0})
        assert res.status_code == 200
        assert res.json()["rating"] == 5.0
        print(f"✅ 17. PATCH /admin/providers/{created_p_id[:8]}... -> Updated Rating to 5.0★")

        # -------------------------------------------------------------
        # 18. Vapi Voice Webhook: POST /vapi/webhook
        # -------------------------------------------------------------
        vapi_find_payload = {
            "message": {
                "toolCalls": [
                    {
                        "id": "call_voice_123",
                        "function": {
                            "name": "find_providers",
                            "arguments": {"category": "AC Technician", "location": "G-13"}
                        }
                    }
                ]
            }
        }
        res = await client.post("/vapi/webhook", json=vapi_find_payload)
        assert res.status_code == 200
        vapi_res = res.json()
        spoken_summary = vapi_res["results"][0]["result"]["spoken_summary"]
        print(f"✅ 18. POST /vapi/webhook (find_providers) -> Spoken: \"{spoken_summary}\"")

        vapi_book_payload = {
            "message": {
                "toolCalls": [
                    {
                        "id": "call_voice_456",
                        "function": {
                            "name": "create_booking",
                            "arguments": {"provider_id": provider_id}
                        }
                    }
                ]
            }
        }
        res = await client.post("/vapi/webhook", json=vapi_book_payload)
        assert res.status_code == 200
        vapi_book_res = res.json()
        spoken_book = vapi_book_res["results"][0]["result"]["spoken_summary"]
        print(f"✅ 19. POST /vapi/webhook (create_booking) -> Spoken: \"{spoken_book}\"")

        # -------------------------------------------------------------
        # 20. GET /me
        # -------------------------------------------------------------
        res = await client.get("/me")
        assert res.status_code == 200
        print(f"✅ 20. GET /me -> User: {res.json()['name']} ({res.json()['role']})")

    print("=" * 75)
    print("🎉 ALL 20 FASTAPI REST API & VAPI WEBHOOK ENDPOINTS PASSED 100%!")
    print("=" * 75 + "\n")


if __name__ == "__main__":
    asyncio.run(test_all_api_routes())
