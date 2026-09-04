import urllib.request
import json

VAPI_API_KEY = "d5ad586e-dca2-4756-ae3b-bb16866000d9"
ASSISTANT_ID = "7256aa53-d8eb-4323-baac-f04eee19576f"
WEBHOOK_URL = "https://parallel-upc-outlets-disks.trycloudflare.com/vapi/webhook"

system_prompt = (
    "Aap AI Service Marketplace ke voice assistant hain. "
    "Aap Roman Urdu / Hinglish mein baat karte hain. "
    "Services: AC Technician, Plumber, Electrician, Cleaner, Tutor. "
    "Shehar: Karachi, Lahore, Islamabad, Rawalpindi. "
    "\n\n"
    "RULES:\n"
    "1. Greet sirf pehli dafa system ne kiya hai. Baar baar salam mat karein. Direct jawab dein.\n"
    "2. User se unki service aur area confirm karein, aur foran 'find_providers' tool call karein.\n"
    "3. Tool ke result se top provider ka naam, rating aur ilaaqa batayein aur poochein: 'Kya main booking confirm kar doon?'\n"
    "4. Jab user haan boley, toh foran 'create_booking' tool call karein aur reference code bol kar shukriya ada karein.\n"
    "5. Har jawab chota, seedha aur sirf 1-2 jumlay ka hona chahiye.\n"
    "6. Script hamesha English letters / Roman Urdu mein ho (maslan: 'Ji bilkul, main abhi plumber dhoondhta hoon'). Devanagari ya Arabic rasm-ul-khat istemal na karein."
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
                    "description": "Dhoondein available service providers Pakistan mein.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "category": {
                                "type": "string",
                                "description": "Service category: AC Technician, Plumber, Electrician, Cleaner, Tutor",
                                "enum": ["AC Technician", "Plumber", "Electrician", "Cleaner", "Tutor"]
                            },
                            "location": {
                                "type": "string",
                                "description": "Area ya city, jaise Gulshan Karachi, G-13 Islamabad, DHA"
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
                    "description": "Provider ke saath booking confirm karein.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "provider_id": {
                                "type": "string",
                                "description": "Provider ki UUID"
                            },
                            "slot_id": {
                                "type": "string",
                                "description": "Slot ki UUID"
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
        "provider": "azure",
        "voiceId": "ur-PK-UzmaNeural"
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

with urllib.request.urlopen(req, timeout=15) as resp:
    res = json.loads(resp.read())
    print("ALL SETTINGS APPLIED SUCCESSFULLY!")
    print("Voice:", res.get("voice"))
    print("Transcriber:", res.get("transcriber"))
    print("Webhook URL:", res.get("server", {}).get("url"))
    print("Silence Timeout:", res.get("silenceTimeoutSeconds"))
