from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import Approval, ApprovalLine, User
from app.dependencies import get_db, get_current_user, get_current_admin
from datetime import datetime

router = APIRouter(prefix="/approvals", tags=["approvals"])

@router.post("/{approval_id}/lines")
def add_approval_line(approval_id: int, approver_id: int, order: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    line = ApprovalLine(
        approval_id=approval_id,
        approver_id=approver_id,
        order=order,
        status="대기"
    )
    db.add(line)
    db.commit()
    # 알림 예시 (실제 구현은 별도 함수로)
    # send_notification(approver_id, "결재 요청이 도착했습니다.")
    return {"message": "결재선이 추가되었습니다."}

@router.put("/lines/{line_id}/approve")
def approve_line(line_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    line = db.query(ApprovalLine).filter(ApprovalLine.id == line_id).first()
    if not line:
        raise HTTPException(status_code=404, detail="결재선을 찾을 수 없습니다.")
    if line.approver_id != current_user.id:
        raise HTTPException(status_code=403, detail="승인 권한이 없습니다.")
    line.status = "승인"
    line.decided_at = datetime.utcnow()
    db.commit()
    # 알림 예시 (실제 구현은 별도 함수로)
    # send_notification(line.approval.user_id, "결재가 승인되었습니다.")
    return {"message": "결재가 승인되었습니다."} 