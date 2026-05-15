# 🧠 MindBridge Mental Health Companion

A full-stack SaaS web application for daily mood tracking, 
AI-powered mental health support, and wellness analytics.

##  Features
- 🔐 JWT Authentication (Register/Login)
- 😊 Daily Mood Tracking with Analytics
- 🤖 AI Chat Companion (LangChain + Groq Llama3)
- 📊 Mood Trend Graphs (Recharts)
- ⚠️ Mental Health Risk Prediction (XGBoost ML)

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | FastAPI (Python) |
| Database | SQLite + SQLAlchemy |
| AI Chat | LangChain + Groq API |
| ML Model | XGBoost + Scikit-learn |
| Auth | JWT Tokens + bcrypt |

## Setup & Run

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👩‍💻 Developer
  Areesha Mubeen
