from fastapi import APIRouter, Depends, HTTPException, Response, Query, Request
from sqlalchemy.orm import Session
from typing import Annotated
from database.config import get_db
from models.model import AttendeeDetails


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
