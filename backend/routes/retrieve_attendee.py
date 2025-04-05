from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from database.config import get_db
from models.model import AttendeeDetails
from pydantic import BaseModel, ConfigDict
from middlewares.validate_authentication import validate_authentication

# Create Pydantic models for response serialization
class AttendeeSchema(BaseModel):
    id: str  # Changed from uuid.UUID to str for JSON serialization
    full_name: str
    email: str
    phone_number: Optional[str] = None
    checked_in: Optional[bool] = False
    checked_in_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)  # New style for Pydantic v2

class AttendeesResponse(BaseModel):
    attendees: List[AttendeeSchema]
    
class CheckedInAttendeeSchema(BaseModel):
    id: str  # Changed from uuid.UUID to str for JSON serialization
    full_name: str
    email: str
    phone_number: Optional[str] = None
    checked_in: Optional[bool] = False
    checked_in_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)  # New style for Pydantic v2

router = APIRouter(
    prefix="/attendees",
    tags=["attendees"],
)

@router.get(
    "/",
    response_model=AttendeesResponse,
    dependencies=[Depends(validate_authentication)],
)
async def get_attendees(
    response: Response,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve a list of attendees.
    """
    attendees = db.query(AttendeeDetails).offset(skip).limit(limit).all()
    if not attendees:
        raise HTTPException(status_code=404, detail="No attendees found")
    
    # Add custom header
    response.headers["X-Total-Count"] = str(len(attendees))
    
    # Process attendees to ensure UUIDs are converted to strings
    attendee_list = []
    for attendee in attendees:
        # Convert the SQLAlchemy model to a dict
        attendee_dict = {
            "id": str(attendee.id),  # Convert UUID to string
            "full_name": attendee.full_name,
            "email": attendee.email,
            "phone_number": attendee.phone_number,
            "checked_in": False if attendee.checked_in is None else attendee.checked_in,
            "checked_in_at": None if attendee.checked_in_at is None else str(attendee.checked_in_at)
        }
        attendee_list.append(AttendeeSchema(**attendee_dict))
    
    return AttendeesResponse(attendees=attendee_list)

@router.get(
    "/checked-in",
    response_model=CheckedInAttendeeSchema,
    dependencies=[Depends(validate_authentication)],
)
async def get_checked_in_attendees(
    response: Response,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve a list of checked-in attendees.
    """
    checked_in_attendees = db.query(AttendeeDetails).filter(AttendeeDetails.checked_in == True).offset(skip).limit(limit).all()
    if not checked_in_attendees:
        raise HTTPException(status_code=404, detail="No checked-in attendees found")
    
    # Add custom header
    response.headers["X-Total-Count"] = str(len(checked_in_attendees))
    
    # Process attendees to ensure UUIDs are converted to strings
    attendee_list = []
    for attendee in checked_in_attendees:
        # Convert the SQLAlchemy model to a dict
        attendee_dict = {
            "id": str(attendee.id),  # Convert UUID to string
            "full_name": attendee.full_name,
            "email": attendee.email,
            "phone_number": attendee.phone_number,
            "checked_in": False if attendee.checked_in is None else attendee.checked_in,
            "checked_in_at": None if attendee.checked_in_at is None else str(attendee.checked_in_at)
        }
        attendee_list.append(CheckedInAttendeeSchema(**attendee_dict))
    
    return CheckedInAttendeeSchema(attendees=attendee_list)