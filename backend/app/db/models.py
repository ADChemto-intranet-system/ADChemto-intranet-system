from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import Enum as SqlEnum

Base = declarative_base()

class GenderEnum(str, enum.Enum):
    MALE = "남"
    FEMALE = "여"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(30), unique=True, index=True)
    name_kr = Column(String(50), nullable=False)
    name_en = Column(String(50), nullable=False)
    birth_date = Column(DateTime, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    hire_date = Column(DateTime, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    position_id = Column(Integer, ForeignKey("positions.id"), nullable=False)
    phone_landline = Column(String(20))
    phone_number = Column(String(20), nullable=False)
    resume_file = Column(String(255), nullable=False)
    cover_letter_file = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    profile_image = Column(String(255))  # 프로필 이미지 경로

    department = relationship("Department", back_populates="users")
    position = relationship("Position", back_populates="users")
    attendances = relationship(
        "Attendance",
        back_populates="user",
        foreign_keys="[Attendance.user_id]"
    )
    approvals = relationship("Approval", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    posts = relationship("Post", back_populates="user")
    approved_attendances = relationship(
        "Attendance",
        back_populates="approver",
        foreign_keys="[Attendance.approver_id]"
    )

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    parent_id = Column(Integer, ForeignKey("departments.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="department")
    parent = relationship("Department", remote_side=[id])

class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    level = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="position")

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    status = Column(SqlEnum("출근", "퇴근", "외출", "조퇴", "연장근무", name="attendance_status"), nullable=False)
    approved = Column(Boolean, default=False)
    approver_id = Column(Integer, ForeignKey("users.id"))
    approved_at = Column(DateTime)
    memo = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship(
        "User",
        back_populates="attendances",
        foreign_keys="[Attendance.user_id]"
    )
    approver = relationship(
        "User",
        back_populates="approved_attendances",
        foreign_keys="[Attendance.approver_id]"
    )

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)  # 예: 휴가, 지출 등
    status = Column(String(20), nullable=False)  # 예: 진행중, 승인, 반려
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="approvals")
    approval_lines = relationship("ApprovalLine", back_populates="approval")

class ApprovalLine(Base):
    __tablename__ = "approval_lines"

    id = Column(Integer, primary_key=True, index=True)
    approval_id = Column(Integer, ForeignKey("approvals.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order = Column(Integer, nullable=False)
    status = Column(SqlEnum("대기", "승인", "반려", name="approval_status"), default="대기")
    comment = Column(Text)
    decided_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    approval = relationship("Approval", back_populates="approval_lines")

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    posts = relationship("Post", back_populates="board")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_notice = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    board = relationship("Board", back_populates="posts")
    comments = relationship("Comment", back_populates="post")
    user = relationship("User", back_populates="posts")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    post = relationship("Post", back_populates="comments")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)
    location = Column(String(100))
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    purchase_date = Column(DateTime)
    warranty_date = Column(DateTime)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    histories = relationship("AssetHistory", back_populates="asset")

class AssetHistory(Base):
    __tablename__ = "asset_histories"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(SqlEnum("대여", "반납", "수리", "폐기", name="asset_action"), nullable=False)
    date = Column(DateTime, nullable=False)
    memo = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    asset = relationship("Asset", back_populates="histories")

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    reservations = relationship("Reservation", back_populates="facility")

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(SqlEnum("예약", "승인", "취소", name="reservation_status"), default="예약")
    repeat_rule = Column(String(50))
    purpose = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    facility = relationship("Facility", back_populates="reservations")

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    type = Column(SqlEnum("사내", "부서", "개인", name="schedule_type"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shared_with = Column(String(255))
    is_repeat = Column(Boolean, default=False)
    repeat_rule = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)  # 결재, 게시글, 일정 등
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AttendanceCreate(BaseModel):
    date: datetime
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    memo: Optional[str] = None
    location: Optional[str] = None
    purchase_date: Optional[datetime] = None
    warranty_date: Optional[datetime] = None
    description: Optional[str] = None

    
class AttendanceResponse(AttendanceCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ApprovalCreate(BaseModel):
    type: str
    content: str

class ApprovalResponse(ApprovalCreate):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class AssetCreate(BaseModel):
    asset_code: str
    name: str
    category: str
    status: str
    location: str | None = None
    manager_id: int
    purchase_date: datetime | None = None
    warranty_date: datetime | None = None
    description: str | None = None

class AssetResponse(AssetCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 
