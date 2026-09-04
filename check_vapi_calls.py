import urllib.request
import json

VAPI_API_KEY = "d5ad586e-dca2-4756-ae3b-bb16866000d9"

req = urllib.request.Request(
    "https://api.vapi.ai/call?limit=3",
    headers={"Authorization": f"Bearer {VAPI_API_KEY}", "User-Agent": "Mozilla/5.0"}
)
try:
    with urllib.request.urlopen(req) as resp:
        calls = json.loads(resp.read())
        print(f"Total calls: {len(calls)}")
        for c in calls:
            print("\n==========================================")
            print("Call ID:", c.get("id"))
            print("Status:", c.get("status"))
            print("Ended Reason:", c.get("endedReason"))
            print("Duration:", c.get("duration"), "seconds")
            print("Analysis:", c.get("analysis"))
            msgs = c.get("messages", [])
            print(f"Messages ({len(msgs)}):")
            for m in msgs:
                role = m.get("role")
                content = m.get("message") or m.get("content") or m.get("transcript") or m.get("toolCalls")
                print(f"  {role}: {content}")
except Exception as e:
    print("Error fetching calls:", e)
