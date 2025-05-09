from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DepartmentBase(BaseModel):
    code: str
    name: str
    parent_id: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    parent_id: Optional[int] = None

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    children: List['DepartmentResponse'] = []

    class Config:
        orm_mode = True

# 순환 참조 해결을 위한 업데이트
DepartmentResponse.update_forward_refs() 