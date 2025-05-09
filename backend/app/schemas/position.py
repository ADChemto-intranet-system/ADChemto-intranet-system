from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PositionBase(BaseModel):
    name: str
    level: int

class PositionCreate(PositionBase):
    pass

class PositionUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None

class PositionResponse(PositionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 