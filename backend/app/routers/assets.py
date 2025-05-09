from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.models import Asset, AssetHistory, User
from app.dependencies import get_db, get_current_user, get_current_admin
from datetime import datetime

router = APIRouter(prefix="/assets", tags=["assets"])

@router.post("/{asset_id}/history")
def add_asset_history(asset_id: int, action: str, memo: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    history = AssetHistory(
        asset_id=asset_id,
        user_id=current_user.id,
        action=action,
        date=datetime.utcnow(),
        memo=memo
    )
    db.add(history)
    db.commit()
    # 알림 예시 (실제 구현은 별도 함수로)
    # send_notification(current_user.id, f"자산 {asset_id}에 {action} 이력이 추가되었습니다.")
    return {"message": "자산 이력이 추가되었습니다."}

@router.get("/{asset_id}/history")
def get_asset_history(asset_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # 관리자 또는 자산 담당자만 조회 가능
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="자산을 찾을 수 없습니다.")
    if asset.manager_id != current_user.id and not hasattr(current_user, 'is_admin'):
        raise HTTPException(status_code=403, detail="조회 권한이 없습니다.")
    return db.query(AssetHistory).filter(AssetHistory.asset_id == asset_id).all() 