from sqlalchemy.orm import Session
from app.db.models import Department, Position, User, Board
from datetime import datetime
import bcrypt
from sqlalchemy import text

def create_initial_data(db: Session):
    # 기존 데이터 삭제 (CASCADE)
    db.execute(text("TRUNCATE TABLE users, departments, positions, boards CASCADE"))
    db.commit()
    
    # 부서 데이터
    departments = [
        Department(code="ADMIN", name="경영지원팀", parent_id=None),
        Department(code="RND", name="연구개발팀", parent_id=None),
        Department(code="PROD", name="생산팀", parent_id=None),
        Department(code="QC", name="품질관리팀", parent_id=None),
        Department(code="SALES", name="영업팀", parent_id=None),
    ]
    
    for dept in departments:
        db.add(dept)
    db.commit()  # 부서 데이터 먼저 저장
    
    # 직급 데이터
    positions = [
        Position(name="사장", level=1),
        Position(name="부장", level=2),
        Position(name="과장", level=3),
        Position(name="대리", level=4),
        Position(name="사원", level=5),
    ]
    
    for pos in positions:
        db.add(pos)
    db.commit()  # 직급 데이터 저장
    
    # 게시판 데이터 (공지/커뮤니티 통합)
    board = Board(name="사내 게시판", description="공지 및 커뮤니티 통합 게시판")
    db.add(board)
    db.commit()
    
    # 부서와 직급 ID 확인
    admin_dept = db.query(Department).filter(Department.code == "ADMIN").first()
    rnd_dept = db.query(Department).filter(Department.code == "RND").first()
    president_pos = db.query(Position).filter(Position.name == "사장").first()
    employee_pos = db.query(Position).filter(Position.name == "사원").first()
    
    # 비밀번호 해시 생성
    def get_password_hash(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # 관리자 계정 생성
    admin = User(
        employee_id="ADC_ADMIN_001",
        name_kr="관리자",
        name_en="Admin",
        birth_date=datetime(1990, 1, 1),
        gender="남",
        hire_date=datetime(2024, 1, 1),
        email="admin@adchemto.com",
        password=get_password_hash("admin123!"),
        department_id=admin_dept.id,  # 경영지원팀
        position_id=president_pos.id,  # 사장
        phone_number="010-0000-0000",
        resume_file="",
        cover_letter_file="",
        is_active=True,
        email_verified=True,
        profile_image=""
    )
    
    # 일반 직원 계정 생성
    employee = User(
        employee_id="ADC_2024001",
        name_kr="홍길동",
        name_en="Hong Gil-dong",
        birth_date=datetime(1995, 5, 15),
        gender="남",
        hire_date=datetime(2024, 1, 1),
        email="hong@adchemto.com",
        password=get_password_hash("employee123!"),
        department_id=rnd_dept.id,  # 연구개발팀
        position_id=employee_pos.id,  # 사원
        phone_number="010-1234-5678",
        resume_file="",
        cover_letter_file="",
        is_active=True,
        email_verified=True,
        profile_image=""
    )
    
    db.add(admin)
    db.add(employee)
    db.commit() 