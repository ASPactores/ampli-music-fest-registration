from models.schema import AttendeeSchema
import uuid

def format_attendees(attendees_query_result):
    return [
        AttendeeSchema(
            id=uuid.UUID(str(attendee.id)) if isinstance(attendee.id, str) else attendee.id,
            full_name=attendee.full_name,
            email=attendee.email,
            phone_number=attendee.phone_number,
            checked_in=bool(attendee.checked_in),
            checked_in_at=str(attendee.checked_in_at) if attendee.checked_in_at else None
        )
        for attendee in attendees_query_result
    ]