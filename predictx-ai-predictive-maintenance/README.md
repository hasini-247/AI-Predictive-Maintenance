# PredictX — AI Predictive Maintenance Platform

PredictX is a hackathon-ready demonstration platform for industrial machine condition monitoring. It includes a React + TypeScript dashboard, a Python FastAPI service, a trained Random Forest demo classifier, and SQLite storage for submitted telemetry readings.

## Features

- Industrial fleet dashboard with live simulated temperature, vibration and current telemetry.
- ISO-style vibration severity zones and anomaly / health indicators in the UI.
- Machine fleet, sensor monitoring, prediction, alert, analytics and solution-pipeline views.
- Interactive anomaly injection for bearing, thermal and overload scenarios.
- Python ML endpoint that returns failure probability, risk level, health score, vibration zone, diagnosis and recommended action.
- SQLite telemetry history and model evaluation endpoint.
- API documentation generated at `/docs`.

## Requirements

- Node.js 20.19+ or 22.12+ recommended (Vite 8 requirement).
- Python 3.10+ recommended.
- Windows PowerShell commands are shown below; macOS/Linux can use the equivalent `python3 -m venv .venv` and activation command.

## Run the complete project (two terminals)

### 1. Start the Python ML backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python ml\train_model.py
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

The backend is available at `http://127.0.0.1:8000` and API docs at `http://127.0.0.1:8000/docs`.

### 2. Start the React frontend

Open a second PowerShell terminal:

```powershell
cd predictx-ai-predictive-maintenance
npm install
npm run dev
```

Open `http://localhost:3000`.

Go to **ML Failure Prediction** and click **Run Python ML prediction & save reading**. This sends the selected machine's current sensor readings to FastAPI and stores the prediction in SQLite.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Backend and trained-model status |
| GET | `/api/metrics` | Holdout evaluation metrics |
| POST | `/api/predict` | Predict without saving a reading |
| POST | `/api/telemetry` | Predict and save a telemetry reading |
| GET | `/api/history?limit=100` | Retrieve recent saved readings |

Example POST body:

```json
{
  "machine_id": "CNC-01",
  "temperature_c": 78.2,
  "vibration_mm_s": 5.4,
  "current_a": 34.5,
  "rpm": 1480,
  "acoustic_db": 68,
  "source": "dashboard"
}
```

## GitHub collaboration

Commit and push the complete project folder (including `backend/`, `src/`, `package.json`, and both README files) to one GitHub repository. Do not commit `node_modules`, `.venv`, the generated `.joblib` model, or the SQLite database; `.gitignore` excludes these. Every teammate should follow both startup sections above after cloning.

## Important model limitation

The backend training script generates a reproducible synthetic dataset so the project can run without an external dataset. The displayed holdout accuracy measures performance on that generated dataset only. It must not be presented as verified industrial accuracy. For a real deployment or a strong research claim, replace the generated data with labeled machine histories, split by machine/time to avoid leakage, and validate with domain experts. ISO vibration zones shown here are simplified demonstration thresholds and must be checked against the applicable machine class and standard edition.

## Project structure

```text
predictx-ai-predictive-maintenance/
├── backend/
│   ├── api.py
│   ├── database.py
│   ├── requirements.txt
│   ├── ml/train_model.py
│   ├── models/       # generated model (not committed)
│   └── data/         # SQLite database (not committed)
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── db/
│   ├── types/
│   └── utils/
├── package.json
├── vite.config.ts
└── README.md
```
