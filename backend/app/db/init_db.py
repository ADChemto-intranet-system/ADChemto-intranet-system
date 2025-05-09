from app.db.database import engine, SessionLocal
from app.db.models import Base
from app.db.seed_data import create_initial_data
from sqlalchemy import text

def init_db():
    # 기존 테이블 삭제 (CASCADE)
    with engine.connect() as connection:
        # 모든 테이블의 외래 키 제약 조건을 비활성화
        connection.execute(text("SET CONSTRAINTS ALL DEFERRED"))
        connection.execute(text("DROP SCHEMA public CASCADE"))
        connection.execute(text("CREATE SCHEMA public"))
        connection.execute(text("GRANT ALL ON SCHEMA public TO postgres"))
        connection.execute(text("GRANT ALL ON SCHEMA public TO public"))
    
    # 테이블 생성
    Base.metadata.create_all(bind=engine)
    
    # 세션 생성
    db = SessionLocal()
    try:
        # 초기 데이터 삽입
        create_initial_data(db)
        print("초기 데이터가 성공적으로 삽입되었습니다.")
    except Exception as e:
        print(f"초기 데이터 삽입 중 오류 발생: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 