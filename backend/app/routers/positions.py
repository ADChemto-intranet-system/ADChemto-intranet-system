from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_admin
from app.db.models import Position, User
from app.schemas.position import PositionCreate, PositionUpdate, PositionResponse

router = APIRouter(prefix="/positions", tags=["positions"])

@router.get("/", response_model=List[PositionResponse])
async def get_positions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    positions = db.query(Position).all()
    return positions

@router.post("/", response_model=PositionResponse)
async def create_position(
    position: PositionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    # 직급 이름 중복 확인
    db_pos = db.query(Position).filter(Position.name == position.name).first()
    if db_pos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 존재하는 직급 이름입니다."
        )
    
    # 직급 레벨 중복 확인
    db_pos = db.query(Position).filter(Position.level == position.level).first()
    if db_pos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 존재하는 직급 레벨입니다."
        )
    
    db_pos = Position(**position.dict())
    db.add(db_pos)
    db.commit()
    db.refresh(db_pos)
    return db_pos

@router.get("/{position_id}", response_model=PositionResponse)
async def get_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_pos = db.query(Position).filter(Position.id == position_id).first()
    if db_pos is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="직급을 찾을 수 없습니다."
        )
    return db_pos

@router.put("/{position_id}", response_model=PositionResponse)
async def update_position(
    position_id: int,
    position: PositionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_pos = db.query(Position).filter(Position.id == position_id).first()
    if db_pos is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="직급을 찾을 수 없습니다."
        )
    
    # 직급 이름 중복 확인
    if position.name:
        existing_pos = db.query(Position).filter(
            Position.name == position.name,
            Position.id != position_id
        ).first()
        if existing_pos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 직급 이름입니다."
            )
    
    # 직급 레벨 중복 확인
    if position.level:
        existing_pos = db.query(Position).filter(
            Position.level == position.level,
            Position.id != position_id
        ).first()
        if existing_pos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 직급 레벨입니다."
            )
    
    for field, value in position.dict(exclude_unset=True).items():
        setattr(db_pos, field, value)
    
    db.commit()
    db.refresh(db_pos)
    return db_pos

@router.delete("/{position_id}")
async def delete_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_pos = db.query(Position).filter(Position.id == position_id).first()
    if db_pos is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="직급을 찾을 수 없습니다."
        )
    
    # 해당 직급을 가진 직원이 있는지 확인
    users = db.query(User).filter(User.position_id == position_id).all()
    if users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="해당 직급을 가진 직원이 존재합니다."
        )
    
    db.delete(db_pos)
    db.commit()
    return {"message": "직급이 성공적으로 삭제되었습니다."} 