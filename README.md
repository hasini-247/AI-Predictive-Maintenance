# PredictX: AI-Powered Predictive Maintenance for Industry 4.0

**Hackathon Submission:** An AI-powered predictive maintenance platform for industrial machinery, featuring IoT telemetry simulation, anomaly detection, machine health monitoring, and Remaining Useful Life (RUL) prediction.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-Backend-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)

---

## 📌 Problem Statement

Unplanned industrial equipment failures can cause significant financial losses, production delays, and safety risks.

Traditional maintenance approaches have limitations:

1. **Reactive Maintenance:** Equipment is repaired only after failure, potentially causing expensive downtime.
2. **Preventive Maintenance:** Equipment is serviced according to fixed schedules, sometimes replacing components before they actually need maintenance.

**PredictX** aims to address these challenges through machine health monitoring, sensor telemetry analysis, anomaly detection, and predictive maintenance insights.

The platform helps identify potential equipment problems earlier so maintenance teams can make informed decisions and reduce unexpected downtime.

---

## 🚀 Key Features

- **📡 IoT Sensor Monitoring:** Displays machine telemetry, including vibration, temperature, motor current, RPM, and acoustic readings using simulated sensor data.
- **📈 Vibration Severity Monitoring:** Uses vibration thresholds inspired by ISO 10816-3 guidelines to indicate different machine health conditions.
  - **Zone A – Good:** Normal vibration condition.
  - **Zone B – Satisfactory:** Acceptable for continued operation.
  - **Zone C – Warning:** Unsatisfactory condition requiring attention.
  - **Zone D – Critical:** Dangerous condition requiring immediate inspection.
- **🧠 Machine Learning Predictions:** Provides predictive maintenance insights and machine failure diagnostics.
- **🧪 Anomaly Injection:** Allows users to simulate machine failure conditions and observe changes in machine health indicators.
- **🚨 Maintenance Alerts:** Displays alerts and maintenance work orders with different priority levels.
- **🏭 Machine Fleet Management:** Provides machine profiles, operating information, health indicators, and maintenance details.
- **📊 Analytics Dashboard:** Displays machine health information, telemetry trends, and analytical visualizations.
- **📄 Inspection Reports:** Provides report-generation and printing functionality.
- **🗺️ Solution Pipeline:** Presents the proposed workflow connecting machine sensors, data processing, predictive analytics, and maintenance actions.

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────────────┐
│             INDUSTRIAL MACHINES              │
│                                              │
│  Vibration | Temperature | Current | RPM     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             DATA COLLECTION                  │
│                                              │
│       Sensor Telemetry / Simulated Data      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             DATA PROCESSING                  │
│                                              │
│       Data Preparation and Analysis          │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           PREDICTIVE ANALYTICS               │
│                                              │
│       Machine Learning and Anomaly Detection │
│       Machine Health and Failure Prediction  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             USER DASHBOARD                   │
│                                              │
│       Machine Monitoring and Alerts          │
│       Analytics and Maintenance Insights     │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 19 |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Backend | Python |
| Backend Framework | FastAPI |
| Machine Learning | Python ML libraries |
| Database | SQLite / database integration |
| Version Control | Git and GitHub |

---

## 💻 Installation and Setup

### Prerequisites

Install the following software before running the project:

- Node.js
- npm
- Python 3
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/hasini-247/AI-Predictive-Maintenance.git
cd AI-Predictive-Maintenance
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

### 4. Open the Application

Open your browser and visit:

```text
http://localhost:3000
```

### Backend Setup

The Python backend is located in the nested project directory:

```text
predictx-ai-predictive-maintenance/backend/
```

Install the backend dependencies:

```bash
cd predictx-ai-predictive-maintenance/backend
pip install -r requirements.txt
```

Start the FastAPI application:

```bash
uvicorn api:app --reload
```

The backend API documentation can be accessed at:

```text
http://127.0.0.1:8000/docs
```

---

## 🎓 Hackathon Demo Walkthrough

Judges and evaluators can explore the following features:

1. **Fleet Dashboard:** View machine health indicators and overall fleet information.
2. **IoT Sensor Live:** Explore machine telemetry and sensor readings.
3. **Inject Anomaly:** Simulate a machine anomaly and observe changes in its condition.
4. **ML Failure Prediction:** Explore predictive maintenance insights.
5. **Maintenance Alerts:** Review machine alerts and work orders.
6. **Machine Fleet:** Explore machine profiles and health information.
7. **Analytics:** Review machine performance and telemetry trends.
8. **Export Report:** Explore the report-generation functionality.

**Note:** The current dashboard includes simulated telemetry. Actual industrial sensor integration requires connecting compatible hardware and data communication services.

---

## 📊 Expected Industrial Benefits

Predictive maintenance solutions can help industries:

- Reduce unexpected equipment downtime.
- Identify potential machine failures earlier.
- Improve maintenance planning.
- Reduce unnecessary component replacement.
- Improve equipment reliability.
- Support safer industrial operations.

The actual benefits depend on implementation, equipment conditions, and the accuracy of the predictive models.

---

## 👥 Hackathon Team and Credits

**Project Name:** PredictX – AI-Powered Predictive Maintenance for Industry 4.0

**Project Domain:** Artificial Intelligence, Machine Learning, Industrial IoT

**Purpose:** To develop an intelligent platform that helps monitor industrial machinery and support predictive maintenance decisions.

**Repository:** [AI-Predictive-Maintenance](https://github.com/hasini-247/AI-Predictive-Maintenance)

**License:** MIT
