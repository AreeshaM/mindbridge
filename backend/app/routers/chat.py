from fastapi import APIRouter
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from app.ai.risk_model import predict_risk

load_dotenv()
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    mood: str = ""

class RiskRequest(BaseModel):
    moods: list

@router.post("/chat")
def chat_with_ai(request: ChatRequest):
    try:
        from langchain_groq import ChatGroq
        from langchain_core.messages import HumanMessage, SystemMessage

        llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile"
        )
        messages = [
            SystemMessage(content="You are MindBridge AI, a compassionate mental health companion. Give short warm supportive responses. Max 3 sentences."),
            HumanMessage(content=f"My mood: {request.mood}. {request.message}")
        ]
        response = llm.invoke(messages)
        return {"reply": response.content}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}

@router.post("/risk")
def get_risk(request: RiskRequest):
    result = predict_risk(request.moods)
    return result