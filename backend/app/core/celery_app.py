from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "marketplace_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_always_eager=False,  # Can be set to True during local testing without Redis
    beat_schedule={
        "process-due-notifications-every-minute": {
            "task": "app.workers.tasks.process_due_notifications",
            "schedule": 60.0,  # runs every 60 seconds
        },
    },
)

# Auto-discover tasks
celery_app.autodiscover_tasks(["app.workers"])
