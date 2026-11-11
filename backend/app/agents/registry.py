"""
The multi-agent graph. Four real Agent objects (OpenAI Agents SDK), each
with its own real tool, wired together with handoffs instead of one agent
calling every tool itself:

    Concierge --(has enough info)--> Discovery --(no results)--> Concierge
                                         |
                                (customer picked a slot)
                                         v
                                      Booking --(unsure which slot)--> Discovery
                                         |
                                  (booking confirmed)
                                         v
                                      Followup  (ends the chain)

Built here (not in each agent's own module) because handoffs need every
agent to already exist — Agent.handoffs is a plain mutable list, so this
constructs all four with no handoffs, then wires the graph in one place
where the whole shape is visible at a glance.
"""
from agents import Agent

from app.agents.model_factory import get_model
from app.agents import concierge_agent as _concierge
from app.agents import discovery_agent as _discovery
from app.agents import booking_agent as _booking
from app.agents import followup_agent as _followup
from app.agents.tools.concierge_tools import (
    find_providers_tool,
    create_booking_tool,
    schedule_followup_tool,
)

concierge_agent = Agent(
    name="Concierge",
    handoff_description="Front-of-house triage: works out what service, where, and when.",
    instructions=_concierge.INSTRUCTIONS,
    model=get_model(),
)

discovery_agent = Agent(
    name="Discovery",
    handoff_description="Finds real verified providers for a known category + area.",
    instructions=_discovery.INSTRUCTIONS,
    model=get_model(),
    tools=[find_providers_tool],
)

booking_agent = Agent(
    name="Booking",
    handoff_description="Confirms a booking for a specific provider + slot the customer agreed to.",
    instructions=_booking.INSTRUCTIONS,
    model=get_model(),
    tools=[create_booking_tool],
)

followup_agent = Agent(
    name="Followup",
    handoff_description="Schedules the post-service check-in after a booking is confirmed.",
    instructions=_followup.INSTRUCTIONS,
    model=get_model(),
    tools=[schedule_followup_tool],
)

# Wire the handoff graph (see module docstring).
concierge_agent.handoffs = [discovery_agent]
discovery_agent.handoffs = [booking_agent, concierge_agent]
booking_agent.handoffs = [followup_agent, discovery_agent]
followup_agent.handoffs = [concierge_agent]

AGENTS_BY_NAME = {
    concierge_agent.name: concierge_agent,
    discovery_agent.name: discovery_agent,
    booking_agent.name: booking_agent,
    followup_agent.name: followup_agent,
}
