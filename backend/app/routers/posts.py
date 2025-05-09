from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from typing import List
from app.dependencies import get_db, get_current_user, get_current_admin
from app.db.models import Post, Board, User
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["posts"])

# 게시글 목록 조회 (공지사항 상단 고정)
@router.get("/", response_model=List[PostResponse])
def get_posts(board_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    posts = db.query(Post).options(joinedload(Post.user)).filter(Post.board_id == board_id).order_by(Post.is_notice.desc(), Post.created_at.desc()).all()
    result = []
    for post in posts:
        result.append(PostResponse(
            id=post.id,
            board_id=post.board_id,
            user_id=post.user_id,
            title=post.title,
            content=post.content,
            is_notice=post.is_notice,
            created_at=post.created_at,
            updated_at=post.updated_at,
            author_name=post.user.name_kr if post.user else ""
        ))
    return result

# 게시글 상세 조회
@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    return PostResponse(
        id=post.id,
        board_id=post.board_id,
        user_id=post.user_id,
        title=post.title,
        content=post.content,
        is_notice=post.is_notice,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author_name=post.user.name_kr if post.user else ""
    )

# 게시글 작성
@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 공지사항은 관리자만 작성 가능
    if post.is_notice and not current_user.position.level == 1:
        raise HTTPException(status_code=403, detail="공지사항은 관리자만 작성할 수 있습니다.")
    db_post = Post(
        board_id=post.board_id,
        user_id=current_user.id,
        title=post.title,
        content=post.content,
        is_notice=post.is_notice,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return PostResponse(
        id=db_post.id,
        board_id=db_post.board_id,
        user_id=db_post.user_id,
        title=db_post.title,
        content=db_post.content,
        is_notice=db_post.is_notice,
        created_at=db_post.created_at,
        updated_at=db_post.updated_at,
        author_name=current_user.name_kr
    )

# 게시글 수정
@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, post: PostUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    # 공지사항은 관리자만 수정 가능
    if db_post.is_notice and not current_user.position.level == 1:
        raise HTTPException(status_code=403, detail="공지사항은 관리자만 수정할 수 있습니다.")
    # 본인 글 또는 관리자만 수정 가능
    if db_post.user_id != current_user.id and not current_user.position.level == 1:
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다.")
    for field, value in post.dict(exclude_unset=True).items():
        setattr(db_post, field, value)
    db_post.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_post)
    return PostResponse(
        id=db_post.id,
        board_id=db_post.board_id,
        user_id=db_post.user_id,
        title=db_post.title,
        content=db_post.content,
        is_notice=db_post.is_notice,
        created_at=db_post.created_at,
        updated_at=db_post.updated_at,
        author_name=db_post.user.name_kr if db_post.user else ""
    )

# 게시글 삭제
@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    # 공지사항은 관리자만 삭제 가능
    if db_post.is_notice and not current_user.position.level == 1:
        raise HTTPException(status_code=403, detail="공지사항은 관리자만 삭제할 수 있습니다.")
    # 본인 글 또는 관리자만 삭제 가능
    if db_post.user_id != current_user.id and not current_user.position.level == 1:
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다.")
    db.delete(db_post)
    db.commit()
    return {"message": "게시글이 성공적으로 삭제되었습니다."} 