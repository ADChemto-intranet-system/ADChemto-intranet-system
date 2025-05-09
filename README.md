# ADChemTo 인트라넷 시스템

ADChemTo 회사의 내부 인트라넷 시스템입니다.

## 기술 스택

### 백엔드
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT Authentication

### 프론트엔드
- React
- TypeScript
- Material-UI
- Axios

## 설치 및 실행 방법

### 백엔드 설정
1. PostgreSQL 설치 및 데이터베이스 생성
```bash
# PostgreSQL 설치 후
createdb adchemto_intranet
```

2. Python 가상환경 생성 및 의존성 설치
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. 환경 변수 설정
```bash
# backend/.env 파일 생성
DATABASE_URL=postgresql://postgres:1234@localhost:5432/adchemto_intranet
SECRET_KEY=your-secret-key
```

4. 데이터베이스 마이그레이션
```bash
alembic upgrade head
```

5. 서버 실행
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 프론트엔드 설정
1. 의존성 설치
```bash
cd frontend
npm install
```

2. 개발 서버 실행
```bash
npm start
```

## 주요 기능
- 사용자 인증 및 권한 관리
- 부서 및 직위 관리
- 게시판 시스템
- 자산 관리
- 근태 관리

## 라이선스
이 프로젝트는 ADChemTo의 내부 사용을 위한 것입니다. 