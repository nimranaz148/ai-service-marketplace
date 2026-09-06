 Aapki requirements ke mutabiq hum application ko 3 distinct personas (Roles) mein divide karenge:

    graph TD
        A["Auth Gatekeeper (Login / Signup)"] --> B{"User Role"}
        B -->|admin| C["Super Admin Console"]
        B -->|provider| D["Master Artisan Command Center"]
        B -->|customer| E["Customer Concierge Hub"]
  ──────
  #### 🔐 Auth Gatekeeper Flow (/login, /signup)

  • Login Requirement: User jab tak login nahi karega, wo dashboard ya operations access nahi kar
  sakega (Landing page / public rahegi).
  • Signup Role Selector: Signup karte waqt user apna role select karega:
      1. 👑 System Administrator
      2. 🛠️ Service Provider / Master Artisan
      3. 👤 Customer / Homeowner
  • 1-Click Demo Quick Switcher: Navbar ke top par ek discreet role switcher hoga taake testing ke
  dauran aap foran Admin ↔ Provider ↔ Customer switch kar ke dekh sakein.
  ──────
  #### 👑 ROLE 1: Super Admin (/dashboard/admin)

  Admin poore marketplace ka control tower hoga:

  1. Overview & Global Telemetry:
      • Platform KPIs (Total Sessions, Bookings, GMV, Active Artisans, API Median Latency).
  2. 🏆 High-Active Leaderboards (Aapki Requirement):
      • Customer Leaderboard: Top booking clients, total spend (PKR), booking frequency, loyalty
      badge.
      • Provider Leaderboard: Top rated artisans (★), total jobs completed, on-time rate, total
      payouts.
  3. 👥 Customer Management (Full CRUD):
      • Customers ki list, search by phone/name, status (Active/Suspended), new customer add karna,
      booking history dekhna, edit/delete.
  4. 🛠️ Provider Management (Full CRUD):
      • Artisans roster CRUD: New artisan onboard karna, NADRA verification badge toggle, pricing
      range edit, active/offline status.
  5. ⚡ AI Agent Traces & System Observability:
      • 5-Agent Pipeline execution logs (Intent → Discovery → Ranking → Lock → Followup), sub-
      second latency breakdown, payload inspection.
  6. ⚙️ System Settings:
      • Commission settings, supported metro clusters (Islamabad, Karachi, Lahore), Vapi audio
      channel configs.

  ──────
  #### 🛠️ ROLE 2: Service Provider / Artisan (/dashboard/provider)

  Artisan ka dedicated operating dashboard:

  1. Artisan Command Overview:
      • Today’s scheduled appointments, monthly earnings (PKR), rating score (★), quick toggle:
      "Online (Ready for Dispatch)" vs "In Field (Busy)".
  2. 📋 Assigned Customers & Bookings Management (Aapki Requirement):
      • Is artisan ko AI agents ke zariye assign kiye gaye live jobs.
      • Customer details: Name, Sector/Address, Phone, Job issue, Booking Token (BK-XXXX).
      • Action buttons: "Mark En Route", "Arrived", "Complete Job & Verify Token".
  3. 🔧 Services CRUD & Live Preview (Aapki Requirement):
      • Services CRUD: Artisan apni skills/services add ya edit kar sakta hai (e.g. "Inverter AC
      Gas Refill", "Pipe Leak Repair", "Solar Inverter Calibration"), price aur estimated time set
      karega.
      • Live Client Preview Card: Ek real-time preview card jo dikhayega ke Customer ko marketplace
      par is artisan ki profile aur services kaisi nazar aayengi.
  4. 📅 Availability Slots Manager:
      • Apne working hours aur calendar slots lock ya open karna (9 AM, 11 AM, 2 PM, 4 PM, 6 PM).

  ──────
  #### 👤 ROLE 3: Customer / Client (/dashboard/customer)

  Customer ka personal service concierge:

  1. Customer Concierge Home:
      • Welcome banner + Active booking live tracking pill (e.g. "Tariq Mehmood is on the way — ETA
      15 mins").
      • Quick Re-Book button past artisans ke liye.
      • Live AI Voice & Chat Dispatch box.
  2. 🔍 Browse Verified Artisans Directory (Aapki Requirement):
      • Category & Metro (Islamabad, Karachi, Lahore) filters.
      • Verified master artisans ki profile, reviews, pricing, aur direct "Book This Artisan" modal.
  3. 📑 My Bookings Ledger:
      • Customer ki apni past aur active bookings ka record, confirmation tokens, artisan contact
      number, rating & review submit karne ka modal.
  4. 📍 Saved Addresses & Profile:
      • Home / Office address save karna taake AI agents automatically customer ki exact location
      detect karein.