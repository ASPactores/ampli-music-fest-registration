from database.config import Base, engine
from sqlalchemy.orm import relationship
from sqlalchemy import Column, UUID, String, ForeignKey, Text, Boolean, TIMESTAMP
import uuid

class AttendeeDetails(Base):
    __tablename__ = 'attendee_details'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(Text, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone_number = Column(String, nullable=True)
    checked_in = Column(Boolean, default=False)
    checked_in_at = Column(TIMESTAMP, nullable=True)

    registration_statistics = relationship("RegistrationStatistics", back_populates="attendee", uselist=False, cascade="all, delete")

class RegistrationStatistics(Base):
    __tablename__ = 'registration_statistics'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attendee_id = Column(UUID(as_uuid=True), ForeignKey('attendee_details.id', ondelete='CASCADE'), unique=True, nullable=False)
    up_student = Column(Boolean, nullable=True)
    year_degree = Column(Text, nullable=True)
    affiliation = Column(Text, nullable=True)
    hear_about_event = Column(Text, nullable=True)
    follow_guidelines = Column(Boolean, nullable=True)
    allow_updates = Column(Boolean, nullable=True)

    attendee = relationship("AttendeeDetails", back_populates="registration_statistics")

async def init_db():
    Base.metadata.create_all(bind=engine)
