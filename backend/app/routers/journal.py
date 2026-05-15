from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JournalEntry, User
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

# ── current user nikalna JWT se ──
def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY,
                             algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            raise HTTPException(status_code=401,
                                detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401,
                            detail="Invalid token")

# ── Request schema ──
class JournalCreate(BaseModel):
    mood_score: int        # 1 se 10
    text_entry: str
    emotions: List[str]    # ["anxious", "tired"]

# ── Entry save karo ──
@router.post("/entry")
def create_entry(data: JournalCreate,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    if not 1 <= data.mood_score <= 10:
        raise HTTPException(status_code=400,
                            detail="Mood score 1-10 hona chahiye")
    entry = JournalEntry(
        user_id=current_user.id,
        mood_score=data.mood_score,
        text_entry=data.text_entry,
        emotions=data.emotions
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"message": "Entry saved!", "id": entry.id}

# ── Past entries dekho ──
@router.get("/history")
def get_history(db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    entries = db.query(JournalEntry)\
                .filter_by(user_id=current_user.id)\
                .order_by(JournalEntry.created_at.desc())\
                .all()
    return [
        {
            "id": e.id,
            "mood_score": e.mood_score,
            "text_entry": e.text_entry,
            "emotions": e.emotions,
            "created_at": str(e.created_at)
        }
        for e in entries
    ]