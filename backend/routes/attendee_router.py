from fastapi import APIRouter, Depends, HTTPException, Response, Query, Request
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Annotated
from database.config import get_db
from models.model import AttendeeDetails, RegistrationStatistics
from models.schema import RegistrationSchema, RegistrationFormSchema


from models.schema import PaginatedAttendeesResponse
from utils.pagination import create_pagination_metadata
from utils.format_attendee import format_attendees


# Router setup
router = APIRouter(
    prefix="/attendees",
    tags=["attendees"],
)

@router.get(
    "/",
    response_model=PaginatedAttendeesResponse,
)
async def get_attendees(
    request: Request,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
):
    """
    Retrieve a paginated list of attendees.
    """
    # Calculate offset
    offset = (page - 1) * page_size
    
    # Get total count
    total_count = db.query(AttendeeDetails).count()
    
    # Only retrieve needed records
    attendees = db.query(AttendeeDetails).offset(offset).limit(page_size).all()
    
    # Generate pagination metadata
    pagination = create_pagination_metadata(request, total_count, page, page_size, "/attendees")
    
    # Add custom header
    response.headers["X-Total-Count"] = str(total_count)
    
    # Process attendees
    attendee_list = format_attendees(attendees)
    
    # Return empty list instead of 404 when no items but valid page
    if not attendees and page == 1:
        return PaginatedAttendeesResponse(attendees=[], pagination=pagination)
    
    # Check if requested page is beyond available pages
    if page > pagination.total_pages and pagination.total_pages > 0:
        raise HTTPException(status_code=404, detail=f"Page {page} not found. Total pages: {pagination.total_pages}")
    
    return PaginatedAttendeesResponse(attendees=attendee_list, pagination=pagination)


@router.post(
    "/register",
    response_model=RegistrationFormSchema,
)
async def register_attendee(
    attendee_data: RegistrationFormSchema,
    db: Annotated[Session, Depends(get_db)],
):
    """
    Register a new attendee with registration statistics.
    """
    # Check if the attendee already exists
    existing_attendee = db.query(AttendeeDetails).filter(AttendeeDetails.email == attendee_data.email).first()
    if existing_attendee:
        raise HTTPException(status_code=400, detail="Attendee already registered")

    # Create AttendeeDetails object
    attendee = AttendeeDetails(
        full_name=attendee_data.full_name,
        email=attendee_data.email,
        phone_number=attendee_data.phone_number,
        checked_in=True,  # Automatically checked in
        checked_in_at=func.now()
    )
    db.add(attendee)
    db.flush()  # Get the attendee.id before commit for the FK

    # Create RegistrationStatistics object
    registration_stats = RegistrationStatistics(
        attendee_id=attendee.id,
        up_student=attendee_data.up_student,
        year_degree=attendee_data.year_degree,
        affiliation=attendee_data.affiliation,
        hear_about_event=attendee_data.hear_about_event,
        follow_guidelines=attendee_data.follow_guidelines,
        allow_updates=attendee_data.allow_updates,
    )
    db.add(registration_stats)

    db.commit()
    db.refresh(attendee)

    # Compose response using combined schema
    return RegistrationFormSchema(
        id=attendee.id,
        full_name=attendee.full_name,
        email=attendee.email,
        phone_number=attendee.phone_number,
        up_student=registration_stats.up_student,
        year_degree=registration_stats.year_degree,
        affiliation=registration_stats.affiliation,
        hear_about_event=registration_stats.hear_about_event,
        follow_guidelines=registration_stats.follow_guidelines,
        allow_updates=registration_stats.allow_updates,
    )