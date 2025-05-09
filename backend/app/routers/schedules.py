from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import Schedule, User
from app.dependencies import get_db, get_current_user
from typing import List
from datetime import datetime

router = APIRouter(prefix="/schedules", tags=["schedules"])

@router.post("/")
def create_schedule(schedule_in, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    schedule = Schedule(
        title=schedule_in.title,
        content=schedule_in.content,
        start_time=schedule_in.start_time,
        end_time=schedule_in.end_time,
        type=schedule_in.type,
        owner_id=current_user.id,
        shared_with=schedule_in.shared_with,  # 쉼표로 구분된 user_id 리스트
        is_repeat=schedule_in.is_repeat,
        repeat_rule=schedule_in.repeat_rule
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    # 알림 예시 (실제 구현은 별도 함수로)
    # for uid in schedule_in.shared_with.split(','):
    #     send_notification(uid, "일정이 공유되었습니다.")
    return schedule

@router.get("/shared/", response_model=List)
def get_shared_schedules(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Schedule).filter(Schedule.shared_with.contains(str(current_user.id))).all() 