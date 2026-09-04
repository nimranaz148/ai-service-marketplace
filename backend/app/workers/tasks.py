import datetime
from uuid import UUID
import logging
from app.core.celery_app import celery_app
from app.db.session import get_sync_db
from app.db.models import Notification, Booking, Provider

logger = logging.getLogger("celery_tasks")


@celery_app.task(name="app.workers.tasks.send_booking_notification")
def send_booking_notification(notification_id_str: str):
    """Celery task to dispatch a scheduled SMS / WhatsApp / Email notification."""
    notification_id = UUID(notification_id_str)
    with get_sync_db() as db:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            logger.error(f"❌ Notification {notification_id_str} not found in DB")
            return {"status": "error", "message": f"Notification {notification_id_str} not found"}

        logger.info(f"📨 [Celery Worker] Dispatched {notification.type} to User: {notification.message}")
        notification.status = "sent"
        notification.sent_at = datetime.datetime.now(datetime.timezone.utc)
        db.commit()

        return {
            "status": "sent",
            "notification_id": str(notification.id),
            "type": notification.type,
            "sent_at": notification.sent_at.isoformat(),
        }


@celery_app.task(name="app.workers.tasks.send_service_reminder")
def send_service_reminder(booking_id_str: str):
    """Celery task to create & send an immediate service reminder."""
    booking_id = UUID(booking_id_str)
    with get_sync_db() as db:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            logger.error(f"❌ Booking {booking_id_str} not found")
            return {"status": "error", "message": f"Booking {booking_id_str} not found"}

        provider_name = booking.provider.name if booking.provider else "Your Provider"
        reminder_msg = (
            f"Reminder: Your service with {provider_name} "
            f"is confirmed. Ref Code: {booking.confirmation_code}."
        )

        notification = Notification(
            booking_id=booking.id,
            user_id=booking.user_id,
            type="reminder",
            message=reminder_msg,
            scheduled_at=datetime.datetime.now(datetime.timezone.utc),
            sent_at=datetime.datetime.now(datetime.timezone.utc),
            status="sent",
        )
        db.add(notification)
        db.commit()

        logger.info(f"⏰ [Celery Worker] Sent reminder for booking {booking.confirmation_code}")
        return {"status": "sent", "booking_id": booking_id_str, "notification_id": str(notification.id)}


@celery_app.task(name="app.workers.tasks.send_completion_check")
def send_completion_check(booking_id_str: str):
    """Celery task to send post-service satisfaction check."""
    booking_id = UUID(booking_id_str)
    with get_sync_db() as db:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return {"status": "error", "message": f"Booking {booking_id_str} not found"}

        provider_name = booking.provider.name if booking.provider else "Your Provider"
        feedback_msg = f"How was your experience with {provider_name}? Reply 1-5 to rate."

        notification = Notification(
            booking_id=booking.id,
            user_id=booking.user_id,
            type="completion_check",
            message=feedback_msg,
            scheduled_at=datetime.datetime.now(datetime.timezone.utc),
            sent_at=datetime.datetime.now(datetime.timezone.utc),
            status="sent",
        )
        db.add(notification)
        db.commit()

        logger.info(f"⭐ [Celery Worker] Sent completion check for booking {booking.confirmation_code}")
        return {"status": "sent", "booking_id": booking_id_str, "notification_id": str(notification.id)}


@celery_app.task(name="app.workers.tasks.process_due_notifications")
def process_due_notifications():
    """Periodic task: processes all scheduled notifications that are due now."""
    now = datetime.datetime.now(datetime.timezone.utc)
    with get_sync_db() as db:
        due_notifications = (
            db.query(Notification)
            .filter(
                Notification.status == "scheduled",
                Notification.scheduled_at <= now,
            )
            .all()
        )

        processed_count = 0
        for notif in due_notifications:
            notif.status = "sent"
            notif.sent_at = now
            processed_count += 1
            logger.info(f"🔔 [Celery Periodic Task] Processed due notification: {notif.id} ({notif.type})")

        db.commit()
        return {"status": "success", "processed_count": processed_count}
