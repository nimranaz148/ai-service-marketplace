import logging
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.outputs import RankingOutput
from app.agents.tools.ranking_tools import rank_providers
from app.agents.tools.trace_tools import write_trace_log

logger = logging.getLogger("ranking_agent")


class RankingAgent:
    """Agent responsible for scoring and ranking providers using weighted criteria."""

    def __init__(self):
        self.name = "RankingAgent"

    async def run(
        self,
        providers_list: List[Dict[str, Any]],
        time_preference: str,
        session_id: str,
        step: int,
        db: AsyncSession,
    ) -> Tuple[RankingOutput, int]:
        logger.info(f"📊 [{self.name}] Ranking {len(providers_list)} providers for time='{time_preference}'")

        # 1. Execute function tool
        ranking_out, duration_ms = rank_providers(
            providers_list=providers_list,
            time_preference=time_preference,
        )

        # 2. Record execution trace
        await write_trace_log(
            session_id=session_id,
            step=step,
            agent_name=self.name,
            tool_used="rank_providers",
            input_payload={"providers_count": len(providers_list), "time_preference": time_preference},
            output_payload=ranking_out.model_dump(),
            output_summary=(
                f"Ranked {len(ranking_out.ranked_providers)} providers. "
                f"Selected '{ranking_out.top_provider_name}' as best match."
            ),
            duration_ms=duration_ms,
            db=db,
        )

        return ranking_out, duration_ms


ranking_agent = RankingAgent()
