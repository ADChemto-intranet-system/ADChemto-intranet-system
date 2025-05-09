from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import Attendance, User
from app.dependencies import get_db, get_current_user, get_current_admin
from datetime import datetime

router = APIRouter(prefix="/attendances", tags=["attendances"])

@router.put("/{attendance_id}/approve")
def approve_attendance(attendance_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="근태 기록을 찾을 수 없습니다.")
    attendance.approved = True
    attendance.approver_id = current_admin.id
    attendance.approved_at = datetime.utcnow()
    # 알림 예시 (실제 구현은 별도 함수로)
    # send_notification(attendance.user_id, "근태가 승인되었습니다.")
    db.commit()
    return {"message": "근태가 승인되었습니다."}

@router.put("/{attendance_id}")
def update_attendance(attendance_id: int, update_data: dict, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="근태 기록을 찾을 수 없습니다.")
    for key, value in update_data.items():
        setattr(attendance, key, value)
    db.commit()
    return {"message": "근태 기록이 수정되었습니다."}

@router.get("/")
def get_attendances(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Attendance).all() 