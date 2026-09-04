import math
import time
from typing import List, Dict, Any, Tuple
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Provider, ProviderSlot

# Islamabad area coordinates for proximity estimation
AREA_COORDINATES = {
    "G-13": (33.6493, 72.9733),
    "G-11": (33.6680, 72.9980),
    "G-10": (33.6780, 73.0120),
    "F-10": (33.6938, 73.0116),
    "F-11": (33.6850, 72.9850),
    "I-8": (33.6685, 73.0760),
    "I-9": (33.6600, 73.0600),
    "BLUE AREA": (33.7100, 73.0600),
    "BAHRIA TOWN": (33.5300, 73.1200),
}


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two coordinates in kilometers using Haversine formula."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


async def find_providers(
    category: str,
    location_text: str,
    db: AsyncSession,
) -> Tuple[List[Dict[str, Any]], int]:
    """Finds active providers matching service category and attaches available slots + distance.
    Returns (provider_list, duration_ms).
    """
    start_time = time.perf_counter()

    # Normalize location
    norm_location = location_text.upper().strip()
    target_lat, target_lng = AREA_COORDINATES.get(norm_location, (33.6493, 72.9733))

    # Query active providers
    stmt = (
        select(Provider)
        .where(Provider.is_active == True)
        .options(selectinload(Provider.slots))
    )

    result = await db.execute(stmt)
    all_providers = result.scalars().all()

    matching_providers = []
    category_lower = category.lower()

    for p in all_providers:
        # Match category or partial category
        if category_lower in p.category.lower() or p.category.lower() in category_lower:
            dist = calculate_haversine_distance(target_lat, target_lng, p.lat, p.lng)
            
            # Filter available unbooked slots
            available_slots = [
                {"id": str(s.id), "date": str(s.slot_date), "time": s.slot_time}
                for s in p.slots
                if not s.is_booked
            ]

            matching_providers.append({
                "id": str(p.id),
                "name": p.name,
                "category": p.category,
                "area": p.area,
                "lat": p.lat,
                "lng": p.lng,
                "rating": p.rating,
                "jobs_completed": p.jobs_completed,
                "price_range": p.price_range,
                "distance_km": dist,
                "available_slots_count": len(available_slots),
                "slots": available_slots[:5],  # Top 5 upcoming slots
            })

    # Sort initially by distance
    matching_providers.sort(key=lambda x: x["distance_km"])
    duration_ms = int((time.perf_counter() - start_time) * 1000)

    return matching_providers, duration_ms
