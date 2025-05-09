from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    employee_id: str
    name_kr: str
    name_en: str
    birth_date: datetime
    gender: str
    hire_date: datetime
    email: EmailStr
    department_id: int
    position_id: int
    phone_number: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    employee_id: Optional[str] = None
    name_kr: Optional[str] = None
    name_en: Optional[str] = None
    birth_date: Optional[datetime] = None
    gender: Optional[str] = None
    hire_date: Optional[datetime] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    department_id: Optional[int] = None
    position_id: Optional[int] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    email_verified: bool
    created_at: datetime
    profile_image: Optional[str] = None

    class Config:
        orm_mode = True 