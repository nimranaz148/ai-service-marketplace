import datetime
import uuid
from app.db.session import sync_engine, Base, get_sync_db
from app.db.models import User, Provider, ProviderSlot, Session, Booking, TraceLog, IntentResult, Notification


def seed_database():
    """Align the database with the canonical demo fixture set.

    Seeds the 3 personas / 10 providers that mirror ``admin-web/lib/fixtures``
    (personas.ts, providers.ts) across Karachi, Islamabad and Lahore, plus their
    slots, sessions, bookings and trace logs.

    Behaviour and limits:
      * Add-only and idempotent — rows are keyed by fixed UUIDs, so re-running
        this does not duplicate the canonical rows.
      * It ASSUMES A CLEAN DATABASE. It does NOT prune pre-existing legacy rows:
        anything seeded by an earlier schema or inserted by hand survives, and
        will sit alongside the canonical set. Drop/recreate the database if you
        need the canonical set to be the *only* content.
    """
    print("🚀 Initializing database schema...")
    Base.metadata.create_all(bind=sync_engine)

    with get_sync_db() as db:
        print("🌱 Seeding Users (Karachi, Islamabad, Lahore)...")
        # Define users
        users = [
            # Admin persona — matches admin-web/lib/fixtures/personas.ts
            User(
                id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
                clerk_user_id="user_demo_admin_1",
                name="Ayesha Malik",
                phone="+92 51 888 2040",
                role="admin",
                preferred_language="english",
                area="Blue Area, Islamabad",
                lat=33.7106,
                lng=73.0551,
            ),
            # Provider persona — matches personas.ts (isb / Sector G-13 / AC)
            User(
                id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
                clerk_user_id="user_demo_provider_1",
                name="Tariq Mehmood",
                phone="+92 301 555 4321",
                role="provider",
                preferred_language="roman_urdu",
                area="Sector G-13, Islamabad",
                lat=33.6470,
                lng=72.9700,
            ),
            # Customer persona — matches personas.ts (khi / Gulshan-e-Iqbal)
            User(
                id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
                clerk_user_id="user_demo_customer_1",
                name="Zubair Khan",
                phone="+92 300 987 6543",
                role="customer",
                preferred_language="roman_urdu",
                area="Gulshan-e-Iqbal, Karachi",
                lat=24.9207,
                lng=67.0982,
            ),
        ]

        # Add or update users
        for u in users:
            existing = db.query(User).filter(User.id == u.id).first()
            if not existing:
                db.add(u)
        db.flush()

        print("🌱 Seeding Providers (Karachi + Nationwide)...")
        providers = [
            # Roster mirrors admin-web/lib/fixtures/providers.ts (prov-01 .. prov-10)
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000001"),
                name="Tariq Mehmood",
                category="AC Technician",
                area="Sector G-13, Islamabad",
                lat=33.6470,
                lng=72.9700,
                rating=4.9,
                jobs_completed=142,
                price_range="PKR 2500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000002"),
                name="Imran Baig",
                category="AC Technician",
                area="Gulshan-e-Iqbal, Karachi",
                lat=24.9215,
                lng=67.0990,
                rating=4.8,
                jobs_completed=185,
                price_range="PKR 2500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000003"),
                name="Kashif Siddiqui",
                category="Electrician",
                area="Gulshan-e-Iqbal, Karachi",
                lat=24.9215,
                lng=67.0990,
                rating=4.7,
                jobs_completed=210,
                price_range="PKR 2000",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000004"),
                name="Naveed Akhtar",
                category="Electrician",
                area="Sector G-13, Islamabad",
                lat=33.6470,
                lng=72.9700,
                rating=4.8,
                jobs_completed=110,
                price_range="PKR 1800",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000005"),
                name="Arshad Hussain",
                category="Plumber",
                area="Gulistan-e-Johar, Karachi",
                lat=24.9180,
                lng=67.1250,
                rating=4.7,
                jobs_completed=98,
                price_range="PKR 1500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000006"),
                name="Rafiq Masih",
                category="Plumber",
                area="Sector F-10, Islamabad",
                lat=33.6920,
                lng=73.0150,
                rating=4.6,
                jobs_completed=75,
                price_range="PKR 1500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000007"),
                name="Bushra Cleaning Co.",
                category="Cleaner",
                area="North Nazimabad, Karachi",
                lat=24.9380,
                lng=67.0420,
                rating=4.9,
                jobs_completed=310,
                price_range="PKR 3500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000008"),
                name="Capital Deep Clean",
                category="Cleaner",
                area="Sector F-10, Islamabad",
                lat=33.6920,
                lng=73.0150,
                rating=4.9,
                jobs_completed=215,
                price_range="PKR 3500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000009"),
                name="Dr. Usman Farooq",
                category="Tutor",
                area="Johar Town, Lahore",
                lat=31.4700,
                lng=74.2700,
                rating=5.0,
                jobs_completed=89,
                price_range="PKR 15000/mo",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("a0000000-0000-0000-0000-000000000010"),
                name="Sana Tutors",
                category="Tutor",
                area="Clifton, Karachi",
                lat=24.8230,
                lng=67.0320,
                rating=4.8,
                jobs_completed=64,
                price_range="PKR 12000/mo",
                is_active=False,
            ),
        ]

        # Add providers
        for prov in providers:
            existing = db.query(Provider).filter(Provider.id == prov.id).first()
            if not existing:
                db.add(prov)
        db.flush()

        print("🌱 Seeding Provider Availability Slots for the next 7 days...")
        today = datetime.date.today()
        times = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"]

        for prov in providers:
            # Check if slots exist for this provider
            existing_slots = db.query(ProviderSlot).filter(ProviderSlot.provider_id == prov.id).first()
            if not existing_slots:
                for day_offset in range(7):
                    slot_date = today + datetime.timedelta(days=day_offset)
                    for t in times:
                        db.add(
                            ProviderSlot(
                                id=uuid.uuid4(),
                                provider_id=prov.id,
                                slot_date=slot_date,
                                slot_time=t,
                                is_booked=False,
                            )
                        )

        db.commit()
        print("✅ Successfully seeded Karachi & Nationwide providers, users, and slots to Supabase!")


if __name__ == "__main__":
    seed_database()
