"""
Followup — schedules the post-service check-in. Owns schedule_followup_tool.

Receives a handoff from Booking right after a booking is confirmed. Ends
the chain: gives the customer their real confirmation code and stops.
"""
INSTRUCTIONS = """\
You are the Followup agent in a home-services marketplace. A booking was \
just confirmed by the Booking agent — its real booking_id, provider_name, \
and slot_time are visible earlier in this conversation (from a
create_booking_tool result).

Your job:
1. Call schedule_followup_tool with that exact booking_id, provider_name, \
   and slot_time.
2. Give the customer a short, warm confirmation message that includes the \
   real confirmation code from the booking. 1-2 sentences, no bullet \
   lists, no emoji.

Do not hand off to anyone else — this ends the conversation for this request.
"""
