# ResQAI Judge Demonstration Script

## Step-by-Step Judging Walkthrough (5-Minute Demo)

### Step 1: Open the Application & Frame the Problem (30 seconds)
1. Point to the tagline on the Hero Banner:
   > *"From scattered signals to one clear emergency."*
2. Emphasize the core thesis:
   > *"Emergency dispatchers don't suffer from a lack of information. They suffer from fragmented information. A single urban flood generates calls in Telugu, messages in English, rumors on Twitter, and radios from NDRF. ResQAI synthesizes all of them into ONE clear incident picture using ONE Gemini AI Brain."*

---

### Step 2: The Core Live Demo (90 seconds)
1. Click the **"START LIVE DEMO"** button in the header.
2. Advance through the 6-step simulation (or toggle **AUTO PLAY**):
   * **Step 1 (08:10 AM):** Show 112 emergency call ("Water entered houses near Velachery MRTS west gate, 6 people trapped").
     * *Highlight:* ResQAI creates incident **#INC-001**, flags flood, extracts landmark, and assigns High Urgency.
   * **Step 2 (08:16 AM):** Show incoming WhatsApp message in Telugu-English (*"Station venakala Vijayanagar side lo water vachindi, same place an elderly person inside lo unnaru"*).
     * *Highlight:* Gemini recognizes Telugu without translation, identifies "station venakala" as the same landmark, matches INC-001 (100% similarity), and appends an elderly vulnerable citizen!
   * **Step 3 (08:25 AM):** Show SMS Alert (*"Update from MRTS west gate: count is 10 people now trapped on roof"*).
     * *Highlight:* Conflict handling! Count updates from 6 → 10. The prior count of 6 is not deleted; it is preserved in the timeline.
   * **Step 4 (08:40 AM):** Show Twitter alert (*"water rising rapidly"*).
     * *Highlight:* Urgency automatically escalates to **CRITICAL**. ResQAI recommends a **Rescue Boat**, with the human approval advisory badge.
   * **Step 5 (09:05 AM):** Show NDRF radio update (*"Rescue boat team reached"*).
     * *Highlight:* Operational status updates to **RESCUE IN PROGRESS**.
   * **Step 6 (09:30 AM):** Show Fire Commander update (*"All 10 residents evacuated safely. Everyone rescued"*).
     * *Highlight:* Status transitions to **RESOLVED**.
3. **Closing punchline for judges:**
   > *"Notice what happened: 6 scattered signals from 5 different communication channels in 2 languages became exactly ONE evolving incident record."*

---

### Step 3: Inspect the Incident & Explainable AI (60 seconds)
1. Close the demo modal and click on **#INC-001** in the incident list or map.
2. Open the Incident Detail Modal and show the judges:
   * **Indian Landmark Intelligence:** Show the normalized location and explain why ResQAI flags `APPROXIMATE LOCATION (87%)` instead of hallucinating fake GPS coordinates.
   * **People Count History:** Show `6 (08:10 AM) → 10 (08:25 AM)`.
   * **What Changed Log:** Point out the clear, timestamped audit trail.
   * **Explainable AI Evidence:** Review the 5 factor scores (*Landmark 94%, Location Context 92%, Semantic 94%, Time 95%, Type 100%*).
   * **Advisory Badge:** Show *"AI Recommendation — Human approval required"*.

---

### Step 4: Live Ingestion Console & Telugu Test (45 seconds)
1. Switch to the **"Live Ingestion Console"** tab.
2. Select the preset: **"Telugu Flood (10 Trapped + Elderly)"**.
3. Click **"ANALYZE WITH GEMINI"**.
4. Show the visual pipeline progression:
   `INGEST ✓ → UNDERSTAND ✓ → EXTRACT ✓ → TRACK & CLUSTER ✓ → SHOW STATE ✓`
5. Toggle **"View Schema JSON"** to prove strict structured schema validation.
6. Try the **"Noise Traffic Tweet"** preset and show how it is quarantined as a non-emergency without polluting the responder dashboard.

---

### Step 5: Large Dataset Evaluation (45 seconds)
1. Click **"LOAD DEMO DATA (52)"** in the top navigation.
2. Point out the KPI counters:
   * **50+ raw reports ingested**
   * **28+ clustered duplicates consolidated**
   * **Noise filtered**
   * **5 distinct incidents synthesized across Chennai**
3. Open the **"Analytics & Triage Metrics"** tab to view Recharts breakdowns of disaster types, urgency distributions, and operational lifecycles.
