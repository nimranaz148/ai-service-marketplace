import os
import sys
import uuid
import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.celery_app import celery_app
from app.db.session import get_sync_db, sync_engine, Base
from app.db.models import User, Provider, Booking, Notification
from app.db.seed import seed_database
from app.workers.tasks import (
    send_booking_notification,
    send_service_reminder,
    send_completion_check,
    process_due_notifications,
)


def test_celery_tasks():
    print("=" * 75)
    print("🚀 PHASE 4: CELERY BACKGROUND WORKER & NOTIFICATION PIPELINE TESTS")
    print("=" * 75)

    # 1. Initialize schema & seed database
    Base.metadata.create_all(bind=sync_engine)
    seed_database()

    with get_sync_db() as db:
        user = db.query(User).first()
        provider = db.query(Provider).first()
        assert user is not None and provider is not None

        # -------------------------------------------------------------
        # 1. Test Single Notification Dispatch Task
        # -------------------------------------------------------------
        test_booking = Booking(
            id=uuid.uuid4(),
            provider_id=provider.id,
            user_id=user.id,
            status="confirmed",
            confirmation_code=f"BK-{uuid.uuid4().hex[:4].upper()}",
        )
        db.add(test_booking)
        db.flush()

        test_notif = Notification(
            id=uuid.uuid4(),
            booking_id=test_booking.id,
            user_id=user.id,
            type="reminder",
            message="Test Celery direct reminder dispatch",
            scheduled_at=datetime.datetime.now(datetime.timezone.utc),
            status="scheduled",
        )
        db.add(test_notif)
        db.commit()

        # Run task
        res = send_booking_notification.apply(args=[str(test_notif.id)]).get()
        assert res["status"] == "sent", f"Task failed: {res}"
        print(f"✅ 1. send_booking_notification Task -> Dispatched {res['type']} (Status: {res['status']})")

        # Verify DB status update
        db.refresh(test_notif)
        assert test_notif.status == "sent"
        assert test_notif.sent_at is not None
        print(f"✅ 2. DB Verification -> Notification status updated to 'sent' at {test_notif.sent_at}")

        # -------------------------------------------------------------
        # 2. Test send_service_reminder Task
        # -------------------------------------------------------------
        res_reminder = send_service_reminder.apply(args=[str(test_booking.id)]).get()
        assert res_reminder["status"] == "sent"
        print(f"✅ 3. send_service_reminder Task -> Created & sent reminder for booking {test_booking.confirmation_code}")

        # -------------------------------------------------------------
        # 3. Test send_completion_check Task
        # -------------------------------------------------------------
        res_comp = send_completion_check.apply(args=[str(test_booking.id)]).get()
        assert res_comp["status"] == "sent"
        print(f"✅ 4. send_completion_check Task -> Created & sent feedback check for booking {test_booking.confirmation_code}")

        # -------------------------------------------------------------
        # 4. Test Periodic Batch Dispatch: process_due_notifications
        # -------------------------------------------------------------
        # Create 3 scheduled notifications in the past
        past_time = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=10)
        for i in range(3):
            past_notif = Notification(
                id=uuid.uuid4(),
                booking_id=test_booking.id,
                user_id=user.id,
                type="reminder",
                message=f"Batch Scheduled Reminder #{i+1}",
                scheduled_at=past_time,
                status="scheduled",
            )
            db.add(past_notif)
        db.commit()

        batch_res = process_due_notifications.apply().get()
        assert batch_res["status"] == "success"
        assert batch_res["processed_count"] >= 3
        print(f"✅ 5. process_due_notifications (Beat Periodic Task) -> Processed {batch_res['processed_count']} due notifications")

    print("=" * 75)
    print("🎉 ALL CELERY WORKER TASKS & NOTIFICATION QUEUE TESTS PASSED 100%!")
    print("=" * 75 + "\n")


if __name__ == "__main__":
    test_celery_tasks()
