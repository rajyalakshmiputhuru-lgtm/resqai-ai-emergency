# ResQAI API Specification

## Endpoints Overview

### 1. Health Check
* **Route:** `GET /api/health`
* **Purpose:** Deployment health verification (Requirement #32)
* **Response:**
```json
{
  "status": "ok",
  "service": "ResQAI",
  "ai": "Gemini"
}
```

---

### 2. Live Signal Analysis
* **Route:** `POST /api/analyze`
* **Body:**
```json
{
  "signal": {
    "id": "SIG-001",
    "source": "whatsapp",
    "sender": "+91-98401XXXXX",
    "rawText": "Velachery MRTS daggara water chala perigindi, 10 members trapped unnaru.",
    "language": "Telugu-English",
    "timestamp": "08:16 AM"
  },
  "existingIncidents": []
}
```
* **Response:** Structured JSON matching `AnalysisResult` schema.

---

### 3. Incident Management & Signal Ingestion
* **Route:** `GET /api/incidents`
  * Returns: `{ success: true, incidents: Incident[], stats: Stats, rawReports: EmergencySignal[] }`

* **Route:** `POST /api/incidents`
  * Actions supported:
    1. **Ingest Signal:** `{ signal: EmergencySignal }`
    2. **Seed Benchmark Dataset:** `{ action: "seed_full" }`
    3. **Reset State:** `{ action: "reset" }`

---

### 4. Live Demo Sequence Controller
* **Route:** `GET /api/demo`
  * Returns: `{ sequence: Step[], currentStep: number, totalSteps: 6, incidents: Incident[] }`

* **Route:** `POST /api/demo`
  * Actions:
    1. **Execute Step:** `{ action: "step", stepIndex: 1 }`
    2. **Reset Sequence:** `{ action: "reset" }`
