import logging
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.tools.provider_tools import find_providers
from app.agents.tools.trace_tools import write_trace_log

logger = logging.getLogger("discovery_agent")


class DiscoveryAgent:
    """Agent responsible for discovering active local service providers matching category & location."""

    def __init__(self):
        self.name = "DiscoveryAgent"

    async def run(
        self,
        category: str,
        location: str,
        session_id: str,
        step: int,
        db: AsyncSession,
    ) -> Tuple[List[Dict[str, Any]], int]:
        logger.info(f"🔍 [{self.name}] Searching providers for category='{category}' in location='{location}'")

        # 1. Execute function tool
        providers_list, duration_ms = await find_providers(
            category=category,
            location_text=location,
            db=db,
        )

        # 2. Record execution trace
        await write_trace_log(
            session_id=session_id,
            step=step,
            agent_name=self.name,
            tool_used="find_providers",
            input_payload={"category": category, "location": location},
            output_payload={"total_found": len(providers_list), "providers": providers_list},
            output_summary=f"Discovered {len(providers_list)} active {category} providers near {location}",
            duration_ms=duration_ms,
            db=db,
        )

        return providers_list, duration_ms


discovery_agent = DiscoveryAgent()
