import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from typing import Annotated
from database.config import get_db
from models.model import AttendeeDetails, RegistrationStatistics
from models.schema import PaginatedAttendeesResponse, CheckedInAttendeeResponse
from utils.pagination import create_pagination_metadata
from utils.format_attendee import format_attendees

# Router setup
router = APIRouter(
    prefix="/attendees",
    tags=["attendees"],
)


@router.get(
    "/checked-in",
    response_model=PaginatedAttendeesResponse,
)
async def get_checked_in_attendees(
    request: Request,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
):
    """
    Retrieve a paginated list of checked-in attendees.
    """
    # Calculate offset
    offset = (page - 1) * page_size
    
    # Get total count
    total_count = db.query(AttendeeDetails).filter(AttendeeDetails.checked_in).count()
    
    # Query with filter
    checked_in_attendees = (
        db.query(AttendeeDetails)
        .filter(AttendeeDetails.checked_in)
        .offset(offset)
        .limit(page_size)
        .all()
    )
    
    # Generate pagination metadata
    pagination = create_pagination_metadata(request, total_count, page, page_size, "/attendees/checked-in")
    
    # Add custom header
    response.headers["X-Total-Count"] = str(total_count)
    
    # Process attendees
    attendee_list = format_attendees(checked_in_attendees)
    
    # Return empty list instead of 404 when no items but valid page
    if not checked_in_attendees and page == 1:
        return PaginatedAttendeesResponse(attendees=[], pagination=pagination)
    
    # Check if requested page is beyond available pages
    if page > pagination.total_pages and pagination.total_pages > 0:
        raise HTTPException(status_code=404, detail=f"Page {page} not found. Total pages: {pagination.total_pages}")
    
    return PaginatedAttendeesResponse(attendees=attendee_list, pagination=pagination)

@router.put(
    "/{attendee_id}/check-in",
    response_model=CheckedInAttendeeResponse
)
async def check_in_attendee(
    attendee_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
):
    """
    Check in an attendee by ID.
    """
    # Fetch attendee
    attendee = db.query(AttendeeDetails).options(
            joinedload(AttendeeDetails.registration_statistics)
        ).filter(
            AttendeeDetails.id == attendee_id
        ).first()

    # Check if attendee exists
    if not attendee:
        raise HTTPException(status_code=404, detail="Attendee not found")

    # Check if attendee is already checked in
    if attendee.checked_in:
        return CheckedInAttendeeResponse(
            id=attendee.id,
            full_name=attendee.full_name,
            up_student=attendee.registration_statistics.up_student if attendee.registration_statistics else None,
            year_degree=attendee.registration_statistics.year_degree if attendee.registration_statistics else None,
            affiliation=attendee.registration_statistics.affiliation if attendee.registration_statistics else "",
            status="already checked-in"
        )

    # Update checked_in status
    attendee.checked_in = True
    attendee.checked_in_at = func.now()
    db.commit()
    db.refresh(attendee)

    return CheckedInAttendeeResponse(
        id=attendee.id,
        full_name=attendee.full_name,
        up_student=attendee.registration_statistics.up_student if attendee.registration_statistics else None,
        year_degree=attendee.registration_statistics.year_degree if attendee.registration_statistics else None,
        affiliation=attendee.registration_statistics.affiliation if attendee.registration_statistics else "",
        status="checked-in"
    )