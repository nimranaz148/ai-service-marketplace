import urllib.request
import json

VAPI_API_KEY = "d5ad586e-dca2-4756-ae3b-bb16866000d9"
ASSISTANT_ID = "7256aa53-d8eb-4323-baac-f04eee19576f"
WEBHOOK_URL = "https://parallel-upc-outlets-disks.trycloudflare.com/vapi/webhook"

system_prompt = (
    "You are a friendly and helpful AI Voice Concierge for booking home services in Pakistan.\n\n"
    "LANGUAGE STYLE RULES:\n"
    "- You MUST ALWAYS speak in natural, clean Pakistani Roman Urdu / Hinglish (Latin alphabet only).\n"
    "- Examples of natural phrasing:\n"
    "  * 'Ji zaroor! Aapko kis area mein electrician chahiye?'\n"
    "  * 'Theek hai, main G-13 Islamabad mein plumber dhoondhta hoon.'\n"
    "  * 'Humne Fast Flow Plumbing dhundh liya hai, rating 4.6 star hai. Kya main booking confirm kar doon?'\n"
    "  * 'Aapki booking confirm ho chuki hai! Reference code hai BK-1234. Shukriya!'\n"
    "- NEVER use strange or garbled spellings. Always use clean, recognizable words.\n"
    "- Keep each response short and conversational (1 to 2 sentences maximum).\n"
    "- The greeting 'Assalam-o-Alaikum' was ALREADY spoken when call started. Do NOT repeat salam. Answer the user directly.\n\n"
    "WORKFLOW:\n"
    "1. When user asks for a service and area, call: find_providers(category=..., location=...).\n"
    "2. Tell user the top provider name, rating, and area, and ask to confirm.\n"
    "3. When user says yes/haan/theek hai, call: create_booking(provider_id=...).\n"
    "4. State the confirmation code clearly."
)

payload = {
    "name": "AI Service Marketplace Concierge",
    "server": {
        "url": WEBHOOK_URL,
        "timeoutSeconds": 25
    },
    "silenceTimeoutSeconds": 45,
    "maxDurationSeconds": 600,
    "model": {
        "provider": "openai",
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": system_prompt
            }
        ],
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "find_providers",
                    "description": "Search available service providers in Pakistan.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "category": {
                                "type": "string",
                                "description": "AC Technician, Plumber, Electrician, Cleaner, Tutor",
                                "enum": ["AC Technician", "Plumber", "Electrician", "Cleaner", "Tutor"]
                            },
                            "location": {
                                "type": "string",
                                "description": "Area or city in Pakistan"
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
                    "description": "Confirm a booking with a provider.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "provider_id": {
                                "type": "string",
                                "description": "UUID of the provider"
                            },
                            "slot_id": {
                                "type": "string",
                                "description": "UUID of the slot"
                            }
                        },
                        "required": ["provider_id"]
                    }
                }
            }
        ],
        "temperature": 0.2
    },
    "voice": {
        "provider": "openai",
        "voiceId": "nova"
    },
    "transcriber": {
        "provider": "deepgram",
        "model": "nova-2",
        "language": "multi"
    },
    "firstMessage": "Assalam-o-Alaikum! Main aapka AI Voice Concierge hoon. Karachi, Lahore ya Islamabad mein kis service ki zaroorat hai?"
}

req = urllib.request.Request(
    f"https://api.vapi.ai/assistant/{ASSISTANT_ID}",
    data=json.dumps(payload).encode("utf-8"),
    method="PATCH",
    headers={
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        res = json.loads(resp.read())
        print("PERFECT CONFIGURATION APPLIED!")
        print("Voice:", res.get("voice"))
        print("Transcriber:", res.get("transcriber"))
        print("Webhook:", res.get("server", {}).get("url"))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.read().decode())
