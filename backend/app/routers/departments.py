from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_admin
from app.db.models import Department, User
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("/", response_model=List[DepartmentResponse])
async def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    departments = db.query(Department).all()
    return departments

@router.post("/", response_model=DepartmentResponse)
async def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    # 부서 코드 중복 확인
    db_dept = db.query(Department).filter(Department.code == department.code).first()
    if db_dept:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 존재하는 부서 코드입니다."
        )
    
    # 상위 부서 존재 확인
    if department.parent_id:
        parent_dept = db.query(Department).filter(Department.id == department.parent_id).first()
        if not parent_dept:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="존재하지 않는 상위 부서입니다."
            )
    
    db_dept = Department(**department.dict())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_dept = db.query(Department).filter(Department.id == department_id).first()
    if db_dept is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="부서를 찾을 수 없습니다."
        )
    return db_dept

@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: int,
    department: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_dept = db.query(Department).filter(Department.id == department_id).first()
    if db_dept is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="부서를 찾을 수 없습니다."
        )
    
    # 부서 코드 중복 확인
    if department.code:
        existing_dept = db.query(Department).filter(
            Department.code == department.code,
            Department.id != department_id
        ).first()
        if existing_dept:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 존재하는 부서 코드입니다."
            )
    
    # 상위 부서 존재 확인
    if department.parent_id:
        parent_dept = db.query(Department).filter(Department.id == department.parent_id).first()
        if not parent_dept:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="존재하지 않는 상위 부서입니다."
            )
    
    for field, value in department.dict(exclude_unset=True).items():
        setattr(db_dept, field, value)
    
    db.commit()
    db.refresh(db_dept)
    return db_dept

@router.delete("/{department_id}")
async def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_dept = db.query(Department).filter(Department.id == department_id).first()
    if db_dept is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="부서를 찾을 수 없습니다."
        )
    
    # 하위 부서가 있는지 확인
    child_depts = db.query(Department).filter(Department.parent_id == department_id).all()
    if child_depts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="하위 부서가 존재하는 부서는 삭제할 수 없습니다."
        )
    
    # 부서에 소속된 직원이 있는지 확인
    users = db.query(User).filter(User.department_id == department_id).all()
    if users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="직원이 소속된 부서는 삭제할 수 없습니다."
        )
    
    db.delete(db_dept)
    db.commit()
    return {"message": "부서가 성공적으로 삭제되었습니다."} 