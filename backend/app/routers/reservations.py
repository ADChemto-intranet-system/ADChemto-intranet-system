from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import Reservation, User
from app.dependencies import get_db, get_current_user, get_current_admin
from datetime import datetime, timedelta

router = APIRouter(prefix="/reservations", tags=["reservations"])

@router.post("/")
def create_reservation(reservation_in, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    reservations = []
    if getattr(reservation_in, 'repeat_rule', None):
        for i in range(4):
            start = reservation_in.start_time + timedelta(weeks=i)
            end = reservation_in.end_time + timedelta(weeks=i)
            reservation = Reservation(
                facility_id=reservation_in.facility_id,
                user_id=current_user.id,
                start_time=start,
                end_time=end,
                purpose=reservation_in.purpose,
                status="예약",
                repeat_rule=reservation_in.repeat_rule
            )
            db.add(reservation)
            reservations.append(reservation)
        db.commit()
        return reservations
    else:
        reservation = Reservation(
            facility_id=reservation_in.facility_id,
            user_id=current_user.id,
            start_time=reservation_in.start_time,
            end_time=reservation_in.end_time,
            purpose=reservation_in.purpose,
            status="예약"
        )
        db.add(reservation)
        db.commit()
        db.refresh(reservation)
        return reservation

@router.put("/{reservation_id}/approve")
def approve_reservation(reservation_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다.")
    reservation.status = "승인"
    # 알림 예시 (실제 구현은 별도 함수로)
    # send_notification(reservation.user_id, "예약이 승인되었습니다.")
    db.commit()
    return {"message": "예약이 승인되었습니다."}

@router.put("/{reservation_id}/cancel")
def cancel_reservation(reservation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다.")
    if reservation.user_id != current_user.id and not hasattr(current_user, 'is_admin'):
        raise HTTPException(status_code=403, detail="취소 권한이 없습니다.")
    reservation.status = "취소"
    db.commit()
    return {"message": "예약이 취소되었습니다."} 