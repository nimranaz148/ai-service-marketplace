# Atelier AI — Autonomous Local Services Marketplace

> **Autonomous multi-agent local service dispatch platform for Pakistan**, orchestrating NADRA-vetted master artisans across **Islamabad, Karachi, and Lahore** with real-time Roman Urdu voice comprehension, sub-second dispatch, and 3D spatial interface engineering.

---

## 🌟 Key Architecture & Highlights

- **🎙️ Real-Time Voice WebRTC AI (Vapi RTC):** 16kHz audio stream supporting colloquial **Roman Urdu, Urdu, and English** with zero-delay intent extraction and entity resolution.
- **⚡ 5-Agent Deterministic Symphony:**
  1. **Intent Agent:** Linguistic & urgency parser for colloquial Pakistani phrasing.
  2. **Discovery Agent:** Geospatial radius scanning via Supabase PostgreSQL PostGIS queries.
  3. **Ranking Agent:** Weighted Tri-Factor scoring (Rating 40%, Proximity 35%, Availability 25%).
  4. **Booking Agent:** Atomic state committer with tamper-evident reservation codes.
  5. **Follow-up Agent:** Asynchronous Celery & Redis task scheduler for pre-arrival reminders and escrow verification.
- **💎 Midnight Emerald Obsidian Interface (Next.js 14):**
  - **3D Spatial Coverflow Carousel:** Dynamic `rotateY`, `translateZ`, and responsive mouse parallax for certified Pakistani master artisans.
  - **3D Bento Grid:** Curated trade categories (HVAC, Solar, Hydro, Detailing, STEM) with specular cursor glare and live artisan availability beacons.
  - **Real-Time Acoustic Visualizer:** GSAP-animated WebRTC audio waveform with dialect switching.
  - **Telemetry Diagnostic Terminal:** Full audit traceability with cryptographic hash logs.
- **🛡️ 100% NADRA & Biometric Verification:** Every master artisan verified against national biometric records with escrow-protected dispatch.

---

## 🛠️ Tech Stack

### Frontend (`admin-web`)
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS, CSS 3D Transforms (`preserve-3d`, `perspective: 1200px`)
- **Animations:** GSAP 3.12, Framer Motion, Lucide Icons
- **Voice Client:** Vapi WebRTC SDK (`@vapi-ai/web`)
- **State & Alerts:** Sonner, Radix UI

### Backend (`backend`)
- **API Framework:** FastAPI (Async Python 3.11+)
- **Database:** Supabase PostgreSQL with Alembic Migrations
- **Task Queue:** Celery with Redis broker
- **Voice Engine:** Vapi WebRTC + Deepgram Nova-2 + OpenAI Agents SDK

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- Redis server (local or cloud)
- Supabase PostgreSQL instance

### 2. Frontend Setup
```bash
cd admin-web
npm install
cp .env.example .env.local
# Update your Vapi and Clerk keys in .env.local
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Configure your Supabase database URL and Vapi secrets
uvicorn app.main:app --reload --port 8000
```

### 4. Running Celery Worker
```bash
cd backend
celery -A app.celery_app worker --loglevel=info
```

---

## 📁 Repository Structure

```
├── admin-web/                 # Next.js 14 frontend application
│   ├── app/                   # App Router pages (Home, Services, Bookings, Traces)
│   ├── components/            # High-craft UI & 3D landing components
│   │   └── landing/           # 3D Coverflow, Bento Grid, Hero, Voice Showcase
│   └── lib/                   # API clients & utilities
├── backend/                   # FastAPI backend server
│   ├── app/                   # API routes, models, schemas, and agent dispatch
│   └── alembic/               # Database schema migrations
├── PRD.md                     # Product Requirements Document
├── phases.md                  # Development phase roadmap
└── README.md                  # Project documentation
```

---

## 📜 License & Compliance
Built with production-grade security, biometric data privacy compliance, and strict tamper-evident escrow guarantees.
