from datetime import datetime, timezone
from pathlib import Path
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from database import initialize_db, save_reading, get_history

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "models" / "failure_model.joblib"
app = FastAPI(title="PredictX Predictive Maintenance API", version="1.0.0",
              description="Demo API for industrial telemetry, failure-risk prediction and history.")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
_model_artifact = None


class SensorReading(BaseModel):
    machine_id: str = Field(default="M-001", min_length=1, max_length=80)
    temperature_c: float = Field(..., ge=-20, le=200)
    vibration_mm_s: float = Field(..., ge=0, le=50)
    current_a: float = Field(..., ge=0, le=200)
    rpm: float = Field(default=1480, ge=0, le=10000)
    acoustic_db: float = Field(default=60, ge=0, le=160)
    source: str = Field(default="dashboard", max_length=40)


def get_model():
    global _model_artifact
    if _model_artifact is None:
        if not MODEL_PATH.exists():
            raise HTTPException(status_code=503, detail="Model not trained. Run: python ml/train_model.py")
        _model_artifact = joblib.load(MODEL_PATH)
    return _model_artifact


def infer(reading: SensorReading):
    artifact = get_model()
    values = np.array([[reading.temperature_c, reading.vibration_mm_s,
                        reading.current_a, reading.rpm, reading.acoustic_db]])
    probability = float(artifact["model"].predict_proba(values)[0][1])
    risk = "Critical" if probability >= 0.70 else "Warning" if probability >= 0.35 else "Healthy"
    health = round(max(0, min(100, 100 - probability * 100)), 1)
    v = reading.vibration_mm_s
    zone = "A - Good" if v <= 1.8 else "B - Satisfactory" if v <= 4.5 else "C - Unsatisfactory" if v <= 7.1 else "D - Danger"
    if v >= 7.1:
        diagnosis, action = "Possible bearing wear / rotor imbalance", "Inspect bearings, coupling alignment and vibration spectrum."
    elif reading.temperature_c >= 85:
        diagnosis, action = "Thermal stress / cooling problem", "Check cooling airflow, lubrication and temperature sensors."
    elif reading.current_a >= 45:
        diagnosis, action = "Motor overload / mechanical resistance", "Check load, drive current and rotating assembly for binding."
    elif probability >= 0.35:
        diagnosis, action = "Emerging multi-sensor anomaly", "Schedule an inspection and collect another sensor sample."
    else:
        diagnosis, action = "Normal operating pattern", "Continue routine condition monitoring."
    return {"machine_id": reading.machine_id, "failure_probability": round(probability, 4),
            "failure_probability_percent": round(probability * 100, 1), "risk_level": risk,
            "health_score": health, "iso_vibration_zone": zone,
            "predicted_failure_mode": diagnosis, "recommended_action": action,
            "model_accuracy": artifact["metrics"]["accuracy"],
            "model_note": "Random Forest trained on generated demo data; validate with real plant data."}


@app.on_event("startup")
def startup():
    initialize_db()


@app.get("/")
def root():
    return {"name": "PredictX API", "status": "running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok", "model_trained": MODEL_PATH.exists()}


@app.get("/api/metrics")
def metrics():
    artifact = get_model()
    return artifact["metrics"]


@app.post("/api/predict")
def predict(reading: SensorReading):
    return infer(reading)


@app.post("/api/telemetry")
def ingest(reading: SensorReading):
    result = infer(reading)
    row = reading.model_dump()
    row.update({"timestamp": datetime.now(timezone.utc).isoformat(),
                "failure_probability": result["failure_probability"],
                "risk_level": result["risk_level"], "health_score": result["health_score"]})
    row_id = save_reading(row)
    return {"saved": True, "record_id": row_id, **result}


@app.get("/api/history")
def history(limit: int = Query(default=100, ge=1, le=1000)):
    return {"items": get_history(limit), "count": len(get_history(limit))}
