# backend/app/ai/risk_model.py

import numpy as np
from xgboost import XGBClassifier

# ─── Training Data ────────────────────────────────────────
# Yeh "fake" data hai sirf model train karne ke liye
# Real app mein yeh actual users ka data hoga
# Features: [avg_mood_score, sad_count, anxious_count, angry_count]
# Label: 0 = low risk, 1 = high risk

X_train = np.array([
    [4.5, 0, 0, 0],  # mostly happy → low risk
    [4.0, 1, 0, 0],  # mostly happy → low risk
    [3.5, 1, 1, 0],  # mixed → low risk
    [2.5, 2, 2, 1],  # sad/anxious → high risk
    [2.0, 3, 2, 2],  # very negative → high risk
    [1.5, 4, 3, 3],  # mostly negative → high risk
    [3.0, 1, 2, 0],  # some anxiety → medium (low)
    [1.8, 3, 4, 2],  # anxious dominant → high risk
])

y_train = np.array([0, 0, 0, 1, 1, 1, 0, 1])

# ─── Model Train Karo ─────────────────────────────────────
model = XGBClassifier(n_estimators=50, random_state=42)
model.fit(X_train, y_train)

# ─── Prediction Function ──────────────────────────────────
def predict_risk(mood_entries: list) -> dict:
    """
    mood_entries = list of mood strings
    jaise: ['happy', 'sad', 'anxious', 'happy']
    """
    if not mood_entries:
        return {"risk": "unknown", "message": "No mood data available"}

    # Mood scores
    mood_scores = {
        'happy': 5, 'calm': 4,
        'anxious': 2, 'sad': 2, 'angry': 1
    }

    # Features calculate karo
    scores     = [mood_scores.get(m, 3) for m in mood_entries]
    avg_score  = np.mean(scores)
    sad_count  = mood_entries.count('sad')
    anx_count  = mood_entries.count('anxious')
    ang_count  = mood_entries.count('angry')

    features = np.array([[avg_score, sad_count, anx_count, ang_count]])
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    if prediction == 1:
        return {
            "risk": "high",
            "probability": round(float(probability), 2),
            "message": "Your mood patterns suggest you may need extra support. Consider talking to someone you trust."
        }
    else:
        return {
            "risk": "low",
            "probability": round(float(probability), 2),
            "message": "Your mood patterns look stable. Keep taking care of yourself!"
        }