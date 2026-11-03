# PredictX Python API

## Windows setup (PowerShell)
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python ml\train_model.py
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

API docs: http://127.0.0.1:8000/docs

- `GET /health` — backend/model status
- `GET /api/metrics` — holdout evaluation metrics
- `POST /api/predict` — predict from sensor values
- `POST /api/telemetry` — predict and save a sensor reading
- `GET /api/history` — recent saved readings

Example JSON for `/api/predict`:
```json
{"machine_id":"CNC-01","temperature_c":78.2,"vibration_mm_s":5.4,"current_a":34.5,"rpm":1480,"acoustic_db":68}
```

The included Random Forest is trained on generated demonstration data. Its reported test metrics are not evidence of real-world industrial accuracy. Retrain and validate using representative, labeled plant data before operational use.
