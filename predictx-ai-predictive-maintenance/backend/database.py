from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "predictx.db"


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_db():
    with connect() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            machine_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            temperature_c REAL NOT NULL,
            vibration_mm_s REAL NOT NULL,
            current_a REAL NOT NULL,
            rpm REAL NOT NULL,
            acoustic_db REAL NOT NULL,
            failure_probability REAL NOT NULL,
            risk_level TEXT NOT NULL,
            health_score REAL NOT NULL,
            source TEXT DEFAULT 'dashboard'
        )""")
        conn.commit()


def save_reading(row: dict):
    initialize_db()
    with connect() as conn:
        cur = conn.execute("""INSERT INTO telemetry
            (machine_id,timestamp,temperature_c,vibration_mm_s,current_a,rpm,acoustic_db,
             failure_probability,risk_level,health_score,source)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)""", (
            row["machine_id"], row["timestamp"], row["temperature_c"], row["vibration_mm_s"],
            row["current_a"], row["rpm"], row["acoustic_db"], row["failure_probability"],
            row["risk_level"], row["health_score"], row.get("source", "dashboard")
        ))
        conn.commit()
        return cur.lastrowid


def get_history(limit: int = 100):
    initialize_db()
    with connect() as conn:
        rows = conn.execute("SELECT * FROM telemetry ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    return [dict(r) for r in reversed(rows)]
