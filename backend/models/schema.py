from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
import uuid


class AttendeeSchema(BaseModel):
    id: uuid.UUID
    full_name: str
    email: str
    phone_number: Optional[str] = None
    checked_in: bool = False
    checked_in_at: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class PaginationLinks(BaseModel):
    first: Optional[str] = None
    last: Optional[str] = None
    next: Optional[str] = None
    prev: Optional[str] = None
    self: Optional[str] = None


class PaginationMetadata(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    page_size: int
    has_next: bool
    has_prev: bool
    next_page: Optional[int] = None
    prev_page: Optional[int] = None
    links: PaginationLinks


class PaginatedAttendeesResponse(BaseModel):
    attendees: List[AttendeeSchema]
    pagination: PaginationMetadata

class CheckedInAttendeeResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    up_student: Optional[bool] = None
    year_degree: Optional[str] = None
    affiliation: str
    status: str
    
    model_config = ConfigDict(from_attributes=True)
    
    # @field_validator('id', mode='before')
    # @classmethod
    # def validate_uuid(cls, v):
    #     if isinstance(v, str):
    #         return uuid.UUID(v)
    #     return v
