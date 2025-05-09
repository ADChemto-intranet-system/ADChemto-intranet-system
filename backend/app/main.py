from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, departments, positions
from app.routers import posts
from app.routers import boards

app = FastAPI(title="ADChemTo Intranet System")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*", "Authorization", "Content-Type", "Accept"],
    expose_headers=["*"],
    max_age=3600,
)

# 라우터 등록
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(departments.router)
app.include_router(positions.router)
app.include_router(posts.router)
app.include_router(boards.router)

@app.get("/")
async def root():
    return {"message": "ADChemTo Intranet System API"}

@app.get("/your-error-route")
async def your_error_route():
    return {"message": "이 경로는 정상적으로 동작합니다."} 