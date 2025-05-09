from app.db.database import SessionLocal, engine
from app.db.models import Base, Department, Position, User
from datetime import datetime
from passlib.context import CryptContext

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 비밀번호 해싱을 위한 컨텍스트
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    db = SessionLocal()
    try:
        # 부서 생성
        departments = [
            Department(code="CEO", name="경영진"),
            Department(code="HR", name="인사팀"),
            Department(code="IT", name="IT팀"),
            Department(code="RND", name="연구개발팀"),
            Department(code="MKT", name="마케팅팀"),
            Department(code="SALES", name="영업팀"),
        ]
        for dept in departments:
            db.add(dept)
        db.commit()

        # 직급 생성
        positions = [
            Position(name="사장", level=1),
            Position(name="부장", level=2),
            Position(name="과장", level=3),
            Position(name="대리", level=4),
            Position(name="사원", level=5),
        ]
        for pos in positions:
            db.add(pos)
        db.commit()

        # 관리자 계정 생성
        admin = User(
            employee_id="ADMIN001",
            name_kr="관리자",
            name_en="Administrator",
            birth_date=datetime(1990, 1, 1),
            gender="남",
            hire_date=datetime(2024, 1, 1),
            email="admin@adchemto.com",
            password=pwd_context.hash("admin1234"),
            department_id=1,  # 경영진
            position_id=1,    # 사장
            phone_number="010-0000-0000",
            resume_file="admin_resume.pdf",
            cover_letter_file="admin_cover_letter.pdf",
            is_active=True,
            email_verified=True
        )
        db.add(admin)
        db.commit()

    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!") 