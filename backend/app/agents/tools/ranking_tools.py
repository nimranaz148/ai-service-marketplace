import time
from typing import List, Dict, Any, Tuple
from app.agents.outputs import RankingOutput, RankedProviderItem


def rank_providers(
    providers_list: List[Dict[str, Any]],
    time_preference: str = "",
) -> Tuple[RankingOutput, int]:
    """Ranks matching providers using the PRD formula:
    Score = (Rating_Score * 0.40) + (Proximity_Score * 0.35) + (Availability_Score * 0.25)
    Returns (RankingOutput, duration_ms).
    """
    start_time = time.perf_counter()

    if not providers_list:
        raise ValueError("No providers available to rank.")

    ranked_items: List[RankedProviderItem] = []

    for p in providers_list:
        # Rating Score (0 - 100)
        rating = float(p.get("rating", 4.5))
        rating_score = round((rating / 5.0) * 100, 1)

        # Proximity Score (0 - 100)
        dist_km = float(p.get("distance_km", 5.0))
        proximity_score = round(max(0.0, 100.0 - (dist_km * 10.0)), 1)

        # Availability Score (0 - 100)
        has_slots = len(p.get("slots", [])) > 0
        availability_score = 100.0 if has_slots else 0.0

        # Weighted Total Score
        total_score = round(
            (rating_score * 0.40) + (proximity_score * 0.35) + (availability_score * 0.25),
            2,
        )

        reasoning = (
            f"Rating: {rating}/5.0 (Score: {rating_score}), "
            f"Distance: {dist_km} km (Score: {proximity_score}), "
            f"Available slots: {len(p.get('slots', []))} (Score: {availability_score})"
        )

        ranked_items.append(
            RankedProviderItem(
                provider_id=p["id"],
                provider_name=p["name"],
                category=p["category"],
                area=p["area"],
                rating=rating,
                distance_km=dist_km,
                has_available_slot=has_slots,
                rating_score=rating_score,
                proximity_score=proximity_score,
                availability_score=availability_score,
                total_score=total_score,
                reasoning=reasoning,
            )
        )

    # Sort descending by total score
    ranked_items.sort(key=lambda x: x.total_score, reverse=True)

    top_provider = ranked_items[0]
    selection_reason = (
        f"Selected '{top_provider.provider_name}' as top provider with highest overall score "
        f"({top_provider.total_score}/100) based on rating {top_provider.rating}★ and proximity {top_provider.distance_km}km."
    )

    ranking_output = RankingOutput(
        ranked_providers=ranked_items,
        top_provider_id=top_provider.provider_id,
        top_provider_name=top_provider.provider_name,
        selection_reason=selection_reason,
    )

    duration_ms = int((time.perf_counter() - start_time) * 1000)
    return ranking_output, duration_ms
