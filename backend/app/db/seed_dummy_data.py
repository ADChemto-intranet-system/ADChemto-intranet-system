from app.db.models import User, Department, Position, Asset, Approval
from app.db.database import SessionLocal
from datetime import datetime
import bcrypt
from sqlalchemy import or_

db = SessionLocal()

# 1. 부서 더미 데이터 (id=1 또는 code='ADMIN'이 없으면 생성)
dept = db.query(Department).filter(or_(Department.id == 1, Department.code == "ADMIN")).first()
if not dept:
    dept = Department(id=1, code="ADMIN", name="경영지원팀", created_at=datetime.utcnow())
    db.add(dept)
    db.commit()
else:
    # 이미 있으면 dept 객체 재사용
    pass

# 2. 직급 더미 데이터 (id=1 또는 name='사장'이 없으면 생성)
pos = db.query(Position).filter(or_(Position.id == 1, Position.name == "사장")).first()
if not pos:
    pos = Position(id=1, name="사장", level=1, created_at=datetime.utcnow())
    db.add(pos)
    db.commit()
else:
    pass

# 3. 사용자 더미 데이터 (id=1 또는 email='admin@adchemto.com'이 없으면 생성)
user = db.query(User).filter(or_(User.id == 1, User.email == "admin@adchemto.com")).first()
if not user:
    hashed_pw = bcrypt.hashpw("admin123!".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = User(
        id=1,
        employee_id="ADMIN_001",
        name_kr="관리자",
        name_en="Admin",
        birth_date=datetime(1990, 1, 1),
        gender="남",
        hire_date=datetime(2024, 1, 1),
        email="admin@adchemto.com",
        password=hashed_pw,
        department_id=dept.id,
        position_id=pos.id,
        phone_number="010-0000-0000",
        resume_file="",
        cover_letter_file="",
        is_active=True,
        email_verified=True,
        profile_image=""
    )
    db.add(user)
    db.commit()
else:
    pass

# 4. 자산 더미 데이터 (asset_code='ASSET_001'이 없으면 생성)
asset = db.query(Asset).filter_by(asset_code="ASSET_001").first()
if not asset:
    asset = Asset(
        asset_code="ASSET_001",
        name="노트북",
        category="IT",
        status="사용중",
        location="사무실",
        manager_id=user.id,
        created_at=datetime.utcnow()
    )
    db.add(asset)
    db.commit()
else:
    pass

# 5. 결재 더미 데이터 (user_id, type='지출'이 없으면 생성)
approval = db.query(Approval).filter_by(user_id=user.id, type="지출").first()
if not approval:
    approval = Approval(
        user_id=user.id,
        type="지출",
        status="진행중",
        content="테스트 결재",
        created_at=datetime.utcnow()
    )
    db.add(approval)
    db.commit()
else:
    pass

db.close()
print("더미 데이터가 성공적으로 추가되었습니다.") 