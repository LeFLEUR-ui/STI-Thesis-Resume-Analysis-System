from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

class HRCreate(BaseModel):
    firstName: str    # Matches React formData.firstName
    lastName: str     # Matches React formData.lastName
    email: EmailStr   # Matches React formData.email
    phoneNumber: str  # Matches React formData.phoneNumber
    password: str     # Matches React formData.password

    class Config:
        from_attributes = True

class HRLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class JobResponse(BaseModel):
    id: int
    job_id: str
    title: str
    department: str
    location: str
    employment_type: str # Added
    job_type: str
    salary_range: str
    description: Optional[str] = None # Added
    skills_requirements: str
    is_active: bool
    created_at: datetime # Added

    class Config:
        from_attributes = True