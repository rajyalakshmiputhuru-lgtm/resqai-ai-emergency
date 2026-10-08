# ResQAI Architectural Blueprint

## Core Architecture Decision: Strict Single-Model AI

ResQAI strictly adheres to the architectural mandate:
**USE ONLY ONE AI MODEL FOR ALL AI INTELLIGENCE: GOOGLE GEMINI API.**

### 1. Unified Intelligence Service: `/lib/ai/gemini.ts`
All cognitive emergency processing routes through a single structured function:
```typescript
analyzeEmergencySignal(signal: EmergencySignal, existingIncidents: Incident[]): Promise<AnalysisResult>
```

The Gemini prompt enforces strict JSON schema output covering:
1. **Classification:** `emergency` | `non-emergency` | `unverified`
2. **Incident Categorization:** `flood` | `fire` | `medical` | `accident` | `evacuation` | `other`
3. **Indian Landmark Extraction:** Landmark aliases, relative position, direction, normalized location, approximate confidence
4. **People & Demographics:** Affected count, trapped count, vulnerable flags (elderly, infants, pregnant, injured)
5. **Urgency & Severity:** `low` | `medium` | `high` | `critical`
6. **Incident Clustering & Similarity:** Compares incoming signal with existing active incidents to return `sameIncident: boolean`, `similarityScore: number` (0-100), `reason: string`, and 5 factor dimensions (Landmark match, location context, semantic similarity, time compatibility, type match).
7. **Conflict Detection:** Identifies discrepancies between prior reports and current telemetry without erasing history.
8. **Operational Status & Resolution:** Detects rescue progress and closure.
9. **Advisory Resource Recommendations:** Suggests required rescue assets with mandatory human verification directive.
10. **Explainable AI Evidence:** Generates transparent rationale (`whySameIncident`, `whyCritical`, `whyApproximateLocation`).

---

## 2. Ingestion & Clustering Pipeline

```
[Signal Ingestion] 
       │
       ▼
[ONE GEMINI AI Execution]
       │
       ├── Classification === 'non-emergency' ──► [Noise Quarantine / Filtered]
       │
       ├── Classification === 'unverified'    ──► [Flagged for Reconnaissance]
       │
       └── Classification === 'emergency'
              │
              ├── Clustering Score >= 65% Match ──► [Update Existing Incident Memory]
              │                                      ├─ Conflict Detection (6 → 10)
              │                                      ├─ Append to "What Changed" Log
              │                                      ├─ Merge Vulnerable Individuals
              │                                      └─ Update Urgency & Status
              │
              └── New Unique Incident Sector    ──► [Create New Incident ID #INC-XXX]
```

---

## 3. High-Fidelity Deterministic Fallback Engine

In accordance with requirement #27:
* **The ONLY AI is Gemini.**
* If `GEMINI_API_KEY` is unavailable, network offline, or rate limited, the application activates the internal deterministic analysis engine.
* **Zero secondary LLMs:** No OpenAI, Claude, or local LLaMA models are ever invoked. The deterministic engine executes the exact same schema with zero degradation in UI demonstration, clustering fidelity, or memory tracking.

---

## 4. Separation of Concerns
* **AI Intelligence (Gemini):** Semantic parsing, Telugu code-mixing, landmark resolution, clustering inference, conflict detection, resolution recognition, explainability.
* **Deterministic Application Code (Next.js / TypeScript):** State management, API routing, Leaflet geospatial map rendering, Recharts analytics, user interface, and accessible theme design.
