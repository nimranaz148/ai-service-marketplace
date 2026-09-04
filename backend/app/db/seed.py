import datetime
import uuid
from app.db.session import sync_engine, Base, get_sync_db
from app.db.models import User, Provider, ProviderSlot, Session, Booking, TraceLog, IntentResult, Notification


def seed_database():
    """Seed comprehensive initial data for Karachi, Islamabad, Lahore, etc."""
    print("🚀 Initializing database schema...")
    Base.metadata.create_all(bind=sync_engine)

    with get_sync_db() as db:
        print("🌱 Seeding Users (Karachi, Islamabad, Lahore)...")
        # Define users
        users = [
            # Karachi Users
            User(
                id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
                clerk_user_id="user_demo_customer_1",
                name="Ali Khan",
                phone="+923001234567",
                role="customer",
                preferred_language="roman_urdu",
                area="Gulshan-e-Iqbal, Karachi",
                lat=24.9207,
                lng=67.0982,
            ),
            User(
                id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
                clerk_user_id="user_demo_customer_2",
                name="Usman Ahmed",
                phone="+923011234567",
                role="customer",
                preferred_language="urdu",
                area="DHA Phase 5, Karachi",
                lat=24.8038,
                lng=67.0673,
            ),
            User(
                id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
                clerk_user_id="user_demo_customer_3",
                name="Sara Malik",
                phone="+923021234567",
                role="customer",
                preferred_language="english",
                area="Clifton, Karachi",
                lat=24.8219,
                lng=67.0315,
            ),
            User(
                id=uuid.UUID("44444444-4444-4444-4444-444444444444"),
                clerk_user_id="user_demo_customer_4",
                name="Zubair Siddiqui",
                phone="+923041234567",
                role="customer",
                preferred_language="roman_urdu",
                area="G-13, Islamabad",
                lat=33.6493,
                lng=72.9733,
            ),
            User(
                id=uuid.UUID("99999999-9999-9999-9999-999999999999"),
                clerk_user_id="user_demo_admin_1",
                name="Marketplace Super Admin",
                phone="+923331112233",
                role="admin",
                preferred_language="english",
                area="Karachi Central",
                lat=24.8607,
                lng=67.0011,
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
            # ==============================
            # KARACHI PROVIDERS
            # ==============================
            Provider(
                id=uuid.UUID("1111aaaa-1111-1111-1111-aaaaaaaaaaaa"),
                name="Karachi Cool Air Solutions",
                category="AC Technician",
                area="Gulshan-e-Iqbal, Karachi",
                lat=24.9215,
                lng=67.0990,
                rating=4.9,
                jobs_completed=185,
                price_range="PKR 2500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("1111aaaa-2222-2222-2222-aaaaaaaaaaaa"),
                name="Clifton & DHA Fast AC Repair",
                category="AC Technician",
                area="Clifton, Karachi",
                lat=24.8230,
                lng=67.0320,
                rating=4.8,
                jobs_completed=142,
                price_range="PKR 3000",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("1111bbbb-1111-1111-1111-bbbbbbbbbbbb"),
                name="DHA Master Electrician Works",
                category="Electrician",
                area="DHA Phase 5, Karachi",
                lat=24.8045,
                lng=67.0680,
                rating=4.9,
                jobs_completed=210,
                price_range="PKR 2000",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("1111cccc-1111-1111-1111-cccccccccccc"),
                name="Johar & Gulshan Quick Plumbing",
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
                id=uuid.UUID("1111dddd-1111-1111-1111-dddddddddddd"),
                name="Karachi Deep Cleaners & Sofa Wash",
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
                id=uuid.UUID("1111eeee-1111-1111-1111-eeeeeeeeeeee"),
                name="Karachi Elite Home & Online Tutors",
                category="Tutor",
                area="Gulshan-e-Iqbal, Karachi",
                lat=24.9200,
                lng=67.0950,
                rating=5.0,
                jobs_completed=78,
                price_range="PKR 15000/mo",
                is_active=True,
            ),

            # ==============================
            # ISLAMABAD / RAWALPINDI PROVIDERS
            # ==============================
            Provider(
                id=uuid.UUID("aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa"),
                name="Rashid AC Solutions",
                category="AC Technician",
                area="G-13, Islamabad",
                lat=33.6500,
                lng=72.9700,
                rating=4.9,
                jobs_completed=128,
                price_range="PKR 2500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("aaaaaaaa-2222-2222-2222-aaaaaaaaaaaa"),
                name="Islamabad Cool Master",
                category="AC Technician",
                area="G-11, Islamabad",
                lat=33.6680,
                lng=72.9980,
                rating=4.7,
                jobs_completed=94,
                price_range="PKR 2200",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb"),
                name="Tariq Electric Works",
                category="Electrician",
                area="G-13, Islamabad",
                lat=33.6480,
                lng=72.9720,
                rating=4.8,
                jobs_completed=110,
                price_range="PKR 1800",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("cccccccc-1111-1111-1111-cccccccccccc"),
                name="Fast Flow Plumbing",
                category="Plumber",
                area="G-13, Islamabad",
                lat=33.6510,
                lng=72.9750,
                rating=4.6,
                jobs_completed=75,
                price_range="PKR 1500",
                is_active=True,
            ),
            Provider(
                id=uuid.UUID("dddddddd-1111-1111-1111-dddddddddddd"),
                name="Capital Cleaners & Deep Cleaning",
                category="Cleaner",
                area="F-10, Islamabad",
                lat=33.6920,
                lng=73.0150,
                rating=4.9,
                jobs_completed=215,
                price_range="PKR 3500",
                is_active=True,
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
