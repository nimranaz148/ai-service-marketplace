# =====================================================
# setup_vapi.py - Run this after ngrok is configured
# =====================================================
# Steps:
# 1. python setup_vapi.py --ngrok-url https://xxxx.ngrok-free.app
# =====================================================

import sys
import json
import urllib.request
import urllib.error

VAPI_API_KEY = "d5ad586e-dca2-4756-ae3b-bb16866000d9"
ASSISTANT_ID = "7256aa53-d8eb-4323-baac-f04eee19576f"

def vapi_request(method, path, data=None):
    url = f"https://api.vapi.ai{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(
        url,
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {VAPI_API_KEY}",
            "Content-Type": "application/json",
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read()), resp.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode()), e.code

def configure_assistant(webhook_url):
    print(f"\n[1/3] Configuring Vapi assistant: {ASSISTANT_ID}")
    print(f"      Webhook URL: {webhook_url}")

    payload = {
        "name": "AI Service Marketplace Concierge",
        "server": {
            "url": webhook_url,
            "timeoutSeconds": 20,
        },
        "model": {
            "provider": "openai",
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "Aap AI Service Marketplace ka friendly voice concierge hain. "
                        "Aap Roman Urdu, Urdu, aur English mein baat kar sakte hain. "
                        "Users Pakistan mein ghar ki services book karte hain: "
                        "AC technician, plumber, electrician, cleaner, tutor. "
                        "\n\n"
                        "Workflow:\n"
                        "1. User se service type aur area poochhein.\n"
                        "2. find_providers tool call karein relevant category aur location ke saath.\n"
                        "3. Top provider ka naam aur rating bolein, booking ke liye consent lein.\n"
                        "4. User haan kahe toh create_booking tool call karein.\n"
                        "5. Confirmation code aur time zor se bolein.\n"
                        "\n"
                        "Chhoti aur waضح baatein karein. Zyada text mat bolein.\n"
                        "Agar provider na milein toh doosri area suggest karein."
                    )
                }
            ],
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "name": "find_providers",
                        "description": "Search for available service providers in a given category and location in Pakistan.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "category": {
                                    "type": "string",
                                    "description": "Service category. Must be one of: AC Technician, Plumber, Electrician, Cleaner, Tutor",
                                    "enum": ["AC Technician", "Plumber", "Electrician", "Cleaner", "Tutor"]
                                },
                                "location": {
                                    "type": "string",
                                    "description": "Area, sector, or city in Pakistan. E.g. Gulshan Karachi, DHA Phase 5, G-13 Islamabad"
                                }
                            },
                            "required": ["category", "location"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "create_booking",
                        "description": "Create a confirmed booking with a specific provider and time slot.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "provider_id": {
                                    "type": "string",
                                    "description": "UUID of the selected provider from find_providers result"
                                },
                                "slot_id": {
                                    "type": "string",
                                    "description": "UUID of the selected time slot from find_providers result"
                                }
                            },
                            "required": ["provider_id"]
                        }
                    }
                }
            ],
            "temperature": 0.3,
            "maxTokens": 300,
        },
        "voice": {
            "provider": "azure",
            "voiceId": "en-US-AndrewMultilingualNeural",
        },
        "firstMessage": (
            "Assalam-o-Alaikum! Main aapka AI Service Concierge hoon. "
            "Karachi, Lahore, ya Islamabad mein kaunsi service chahiye aapko?"
        ),
        "endCallMessage": "Shukriya! Aapki service request process ho rahi hai.",
        "transcriber": {
            "provider": "deepgram",
            "model": "nova-2",
            "language": "en",
        },
    }

    result, status = vapi_request("PATCH", f"/assistant/{ASSISTANT_ID}", payload)

    if status in (200, 201):
        print(f"[OK] Assistant configured successfully!")
        print(f"     Name: {result.get('name')}")
        print(f"     Webhook: {result.get('server', {}).get('url')}")
        tools = result.get("model", {}).get("tools", [])
        print(f"     Tools: {[t.get('function', {}).get('name') for t in tools]}")
        return True
    else:
        print(f"[ERROR] Status {status}: {json.dumps(result, indent=2)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2 or "--ngrok-url" not in sys.argv:
        print("Usage: py setup_vapi.py --ngrok-url https://xxxx.ngrok-free.app")
        print("\nTo get ngrok URL:")
        print("  1. ngrok config add-authtoken YOUR_TOKEN")
        print("  2. ngrok http 8000")
        print("  3. Copy the https://xxxx.ngrok-free.app URL")
        sys.exit(1)

    idx = sys.argv.index("--ngrok-url")
    base_url = sys.argv[idx + 1].rstrip("/")
    webhook_url = f"{base_url}/vapi/webhook"

    success = configure_assistant(webhook_url)
    if success:
        print(f"\n✅ All done! Voice agent is fully configured.")
        print(f"   Webhook: {webhook_url}")
        print(f"\n   Now open http://localhost:3000 and press 'Start Voice Concierge'")
    else:
        print("\n❌ Configuration failed. Check your Vapi API key.")
