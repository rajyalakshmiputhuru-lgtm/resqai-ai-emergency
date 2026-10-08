# ResQAI – AI Emergency Response Assistant

> **"From scattered signals to one clear emergency."**

ResQAI is a next-generation operational emergency intelligence assistant designed for 911/112 dispatch centers and disaster response commanders. It solves a fundamental problem: **emergency responders don't suffer from a lack of information; they suffer from fragmented information.**

In major disasters (floods, industrial fires, multi-vehicle pileups), dispatch centers receive a chaotic deluge of audio calls, WhatsApp alerts, SMS messages, and social media reports. ResQAI synthesizes these noisy, code-mixed, landmark-based streams into a single, real-time evolving incident picture.

---

## 🏛️ Strict Single-AI Architecture

```
MANY SCATTERED SIGNALS (Audio Calls, WhatsApp, SMS, Social Media, Field Radio)
                             │
                             ▼
               ┌───────────────────────────┐
               │   ONE GEMINI AI BRAIN     │
               │   (Google Gemini API)     │
               └─────────────┬─────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [UNDERSTAND & EXTRACT]            [CLUSTER & MEMORY]
   - Noise & Rumor Filter            - 94% Similarity Score
   - Telugu-English Code-Mixing      - Sequential Timeline
   - Indian Landmark Intelligence    - Conflict Resolution
   - Vulnerable Individuals (Elderly) - Resolution Detection
            │                                 │
            └────────────────┬────────────────┘
                             ▼
       ONE CLEAR, CONTINUOUSLY EVOLVING INCIDENT (#INC-001)
                             │
                             ▼
       RESPONDER OPERATIONS DASHBOARD (Human-in-the-Loop)
```

### Why ONE AI Model instead of Multi-Agent Chains?
* **Zero Latency Compounding:** Serial agent handoffs introduce dangerous latency during crisis situations.
* **Deterministic Structured JSON:** Strict schema validation guarantees structured telemetry (counts, landmarks, urgency).
* **Guaranteed Fallback:** If offline or API rate limits occur, the high-fidelity deterministic engine executes without ever calling a secondary LLM.
* **Human-in-the-Loop Safety:** The AI provides advisory recommendations with the mandatory directive: `AI Recommendation — Human approval required`. It never autonomously commands or dispatches tactical squads.

---

## 🌟 Key Capabilities

1. **Indian Landmark Intelligence (Top Feature):**
   * Understands natural Indian landmark-based spatial references:
     * *"Near the Velachery MRTS west gate"*
     * *"Behind the station on the Vijayanagar side"*
     * *"Opposite the medical shop near station backside road"*
   * **Rule of Integrity:** Never invents fake GPS coordinates. Flags `isApproximate: true` with confidence scores and renders landmark centroid radius buffers.

2. **Telugu-English Code-Mixed Understanding:**
   * Seamlessly understands code-mixed regional text and speech without manual translation steps:
     * *"Velachery MRTS daggara water chala perigindi, 10 members trapped unnaru. Oka elderly person inside lo unnaru."*
     * Automatically extracts: Flood, Velachery MRTS, 10 trapped, elderly vulnerable citizen, Critical urgency.

3. **Incident Memory & Conflict Tracking:**
   * When casualty or trapped numbers fluctuate (e.g. 6 people at 08:10 → 10 people at 08:25 → 10 rescued at 09:30), ResQAI flags `Conflicting information detected`, preserves the previous count in the immutable timeline history, and displays the latest verified state with source provenance.

4. **Multi-Channel Demo Connectors:**
   * WhatsApp-style, Emergency 112 audio call, SMS gateway, Twitter/X, and Field Responder Radio connectors clearly marked with `DEMO CONNECTOR`.

5. **Operational Operations Dashboard:**
   * Dark emergency operations theme (high contrast, priority indicators, accessible badges).
   * Leaflet OpenStreetMap with approximate area radius visualization.
   * "What Changed" timeline log and Explainable AI Evidence breakdowns.

---

## 🚀 Quick Start

### Prerequisites
* Node.js v18+ or v20+
* npm

### Installation
```bash
git clone https://github.com/rajyalakshmiputhuru-lgtm/resqai-ai-emergency-response.git
cd resqai-ai-emergency-response
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Note: If GEMINI_API_KEY is not set, ResQAI operates in high-fidelity deterministic fallback mode without crashing or calling secondary LLMs).*

### Running Locally
```bash
# Run development server
npm run dev

# Run test suite
npm test

# Run TypeScript type check
npm run typecheck

# Build and run production server
npm run build
npm run start
```
Visit `http://localhost:3000`.

---

## 📊 Live Judge Demo Workflow

1. Click **"START LIVE DEMO"** in the top navigation.
2. Watch the 6 chronological emergency signals process in real time:
   * **08:10 AM:** 112 Call #409 (6 people trapped near Velachery MRTS) → Creates `#INC-001`
   * **08:16 AM:** WhatsApp in Telugu-English ("elderly person inside") → Clustered into `#INC-001`, vulnerable person added
   * **08:25 AM:** SMS Alert ("10 people now on terrace") → Clustered into `#INC-001`, conflict handled (6 → 10)
   * **08:40 AM:** Social Media ("water rising rapidly") → Escalated to `CRITICAL`, rescue boat recommended
   * **09:05 AM:** NDRF Radio ("Rescue team reached") → Status updated to `RESCUE IN PROGRESS`
   * **09:30 AM:** Fire & Rescue Officer ("Everyone rescued") → Status updated to `RESOLVED`
3. Verify that **6 separate signals collapsed into 1 single evolving incident record**.

---

## 📈 Evaluation & Benchmark Dataset
Click **"LOAD DEMO DATA (52)"** to evaluate ResQAI across 52 realistic urban emergency reports covering 5 distinct disasters:
1. Velachery MRTS Flood (South Chennai)
2. Ambattur Industrial Estate Chemical Fire
3. T. Nagar Ranganathan Street Crowd Surge & Medical Collapse
4. OMR Sholinganallur Multi-Vehicle Collision
5. Guindy Kathipara Structural Hazard Evacuation
* Plus 8 noise reports (traffic jams, delivery delays, rumors) accurately filtered.

---

## 🔒 Deployment & Health Check
* Health endpoint: `GET /api/health` → `{"status":"ok","service":"ResQAI","ai":"Gemini"}`
* Render deployment manifest provided in `render.yaml`.
