import urllib.request
import json

VAPI_API_KEY = "d5ad586e-dca2-4756-ae3b-bb16866000d9"
ASSISTANT_ID = "7256aa53-d8eb-4323-baac-f04eee19576f"
WEBHOOK_URL = "https://parallel-upc-outlets-disks.trycloudflare.com/vapi/webhook"

system_prompt = (
    "ROLE & LANGUAGE:\n"
    "- You are an AI Voice Concierge for booking home services in Pakistan.\n"
    "- You MUST ALWAYS speak and respond strictly in HINGLISH / ROMAN URDU (English Latin alphabet only).\n"
    "- Example: 'Theek hai, main Gulshan Karachi mein AC technician check karta hoon.'\n"
    "- NEVER use Devanagari Hindi script. NEVER use Arabic/Urdu script.\n"
    "\n"
    "CRITICAL CONVERSATIONAL RULES:\n"
    "1. DO NOT REPEAT GREETINGS: The greeting 'Assalam-o-Alaikum' has ALREADY been played once when the call connected. Do NOT say Assalam-o-Alaikum or greet again. Directly answer what the user is asking.\n"
    "2. BE RESPONSIVE & CONCISE: Reply in 1 to 2 short sentences. No long speeches.\n"
    "3. WORKFLOW:\n"
    "   - When user specifies a service and area (e.g. 'plumber chahiye G-13 mein'), immediately call tool: find_providers(category=..., location=...).\n"
    "   - When the tool returns providers, announce the top provider name, rating, and area, and ask: 'Kya main aapki booking confirm kar doon?'\n"
    "   - When the user confirms ('haan', 'yes', 'theek hai', 'confirm kar do'), call tool: create_booking(provider_id=...).\n"
    "   - State the confirmation code clearly and thank them."
)

payload = {
    "name": "AI Service Marketplace Concierge",
    "server": {
        "url": WEBHOOK_URL,
        "timeoutSeconds": 20
    },
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
                    "description": "Search for service providers in Pakistan.",
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
                                "description": "Area or city, e.g. Gulshan Karachi, G-13 Islamabad, DHA"
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
                    "description": "Confirm booking with provider.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "provider_id": {
                                "type": "string",
                                "description": "Provider UUID"
                            },
                            "slot_id": {
                                "type": "string",
                                "description": "Slot UUID"
                            }
                        },
                        "required": ["provider_id"]
                    }
                }
            }
        ],
        "temperature": 0.2
    },
    "transcriber": {
        "provider": "deepgram",
        "model": "nova-2",
        "language": "en"
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

with urllib.request.urlopen(req, timeout=15) as resp:
    res = json.loads(resp.read())
    print("VAPI UPDATED SUCCESSFULLY!")
    print("Webhook URL:", res.get("server", {}).get("url"))
