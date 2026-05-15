from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, journal, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MindBridge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(journal.router, prefix="/journal", tags=["Journal"])
app.include_router(chat.router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "MindBridge API Running"}