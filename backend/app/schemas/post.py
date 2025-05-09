from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str
    is_notice: bool = False

class PostCreate(PostBase):
    board_id: int

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_notice: Optional[bool] = None

class PostResponse(BaseModel):
    id: int
    board_id: int
    user_id: int
    title: str
    content: str
    is_notice: bool
    created_at: datetime
    updated_at: datetime
    author_name: str

    class Config:
        orm_mode = True 