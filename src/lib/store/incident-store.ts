import fs from 'fs';
import path from 'path';
import {
  EmergencySignal,
  Incident,
  AnalysisResult,
  WhatChangedEntry,
  IncidentStatus,
} from '@/types';
import { analyzeEmergencySignal } from '@/lib/ai/gemini';
import { FULL_DEMO_REPORTS } from '@/lib/data/dataset';

export interface StoreState {
  incidents: Incident[];
  rawReports: EmergencySignal[];
  noiseReports: EmergencySignal[];
  unverifiedReports: EmergencySignal[];
  lastAnalysis: AnalysisResult | null;
  activeDemoStep: number;
}

// Global server-safe in-memory state
let globalStore: StoreState = {
  incidents: [],
  rawReports: [],
  noiseReports: [],
  unverifiedReports: [],
  lastAnalysis: null,
  activeDemoStep: 0,
};

let isInitialized = false;

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'resqai-store.json');

function loadStoreFromFile(): boolean {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.incidents)) {
        globalStore = {
          incidents: parsed.incidents || [],
          rawReports: parsed.rawReports || [],
          noiseReports: parsed.noiseReports || [],
          unverifiedReports: parsed.unverifiedReports || [],
          lastAnalysis: parsed.lastAnalysis || null,
          activeDemoStep: parsed.activeDemoStep || 0,
        };
        return true;
      }
    }
  } catch (err) {
    console.warn('Notice: Could not load store from file:', err);
  }
  return false;
}

export function persistStoreToFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(globalStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice: Could not persist store to file:', err);
  }
}

export function getStore(): StoreState {
  if (!isInitialized) {
    isInitialized = true;
    const loaded = loadStoreFromFile();
    if (!loaded && globalStore.incidents.length === 0) {
      seedFullBenchmarkDataset().catch((err) =>
        console.warn('Initial benchmark seed notice:', err)
      );
    }
  }
  return globalStore;
}

export function resetStore(): void {
  globalStore = {
    incidents: [],
    rawReports: [],
    noiseReports: [],
    unverifiedReports: [],
    lastAnalysis: null,
    activeDemoStep: 0,
  };
  persistStoreToFile();
}

/**
 * Main ingestion handler passing each signal through ONE GEMINI AI
 */
export async function ingestSignal(signal: EmergencySignal): Promise<{
  incident: Incident | null;
  analysis: AnalysisResult;
  isNewIncident: boolean;
  isNoise: boolean;
}> {
  // Ensure store initialized
  getStore();

  // Store raw signal
  globalStore.rawReports.unshift(signal);

  // 1. Run through ONE GEMINI AI
  const analysis = await analyzeEmergencySignal(signal, globalStore.incidents);
  globalStore.lastAnalysis = analysis;

  // 2. Filter Noise
  if (analysis.classification === 'non-emergency') {
    globalStore.noiseReports.unshift(signal);
    persistStoreToFile();
    return {
      incident: null,
      analysis,
      isNewIncident: false,
      isNoise: true,
    };
  }

  // 3. Track Unverified
  if (analysis.classification === 'unverified') {
    globalStore.unverifiedReports.unshift(signal);
  }

  // 4. Cluster / Update Existing Incident OR Create New
  if (analysis.match.sameIncident && analysis.match.matchedIncidentId) {
    const existingIndex = globalStore.incidents.findIndex(
      (inc) => inc.id === analysis.match.matchedIncidentId
    );

    if (existingIndex !== -1) {
      const existing = { ...globalStore.incidents[existingIndex] };
      existing.signals = [signal, ...existing.signals];
      existing.updatedAt = signal.timestamp;
      existing.aiExplanations = analysis.explanations;
      existing.summary = analysis.summary;

      // Handle conflict in people count
      if (
        analysis.conflictDetection.hasConflict &&
        analysis.people.affected !== null
      ) {
        const prevCount = existing.people.affected ?? 0;
        const newCount = analysis.people.affected;

        const changeEntry: WhatChangedEntry = {
          id: `wc-${Date.now()}-${Math.random()}`,
          timestamp: signal.timestamp,
          type: 'people',
          label: 'People Affected Count Updated',
          from: prevCount,
          to: newCount,
          sourceSignalId: signal.id,
          detail:
            analysis.conflictDetection.explanation ||
            `Count revised from ${prevCount} to ${newCount}`,
        };
        existing.whatChanged = [changeEntry, ...existing.whatChanged];
        existing.people.affected = newCount;
        existing.people.trapped = newCount;
        existing.peopleHistory = [
          ...existing.peopleHistory,
          {
            count: newCount,
            timestamp: signal.timestamp,
            label: `Reported via ${signal.source}`,
          },
        ];
        existing.conflictCount += 1;
      }

      // Handle newly identified vulnerable individuals
      if (analysis.people.vulnerable.length > 0) {
        for (const vuln of analysis.people.vulnerable) {
          const alreadyTracked = existing.people.vulnerable.some(
            (v) => v.type === vuln.type
          );
          if (!alreadyTracked) {
            existing.people.vulnerable = [...existing.people.vulnerable, vuln];
            const changeEntry: WhatChangedEntry = {
              id: `wc-${Date.now()}-${Math.random()}`,
              timestamp: signal.timestamp,
              type: 'vulnerable',
              label: 'Vulnerable Person Identified',
              detail: `+ ${vuln.type.toUpperCase()}: ${vuln.details}`,
              sourceSignalId: signal.id,
            };
            existing.whatChanged = [changeEntry, ...existing.whatChanged];
          }
        }
      }

      // Handle Urgency Escalation
      if (
        (analysis.urgency === 'critical' && existing.urgency !== 'critical') ||
        (analysis.urgency === 'high' && existing.urgency === 'medium')
      ) {
        const changeEntry: WhatChangedEntry = {
          id: `wc-${Date.now()}-${Math.random()}`,
          timestamp: signal.timestamp,
          type: 'urgency',
          label: 'Urgency Escalated',
          from: existing.urgency.toUpperCase(),
          to: analysis.urgency.toUpperCase(),
          sourceSignalId: signal.id,
          detail: analysis.explanations.whyCritical || 'Urgency level elevated based on incoming telemetry.',
        };
        existing.whatChanged = [changeEntry, ...existing.whatChanged];
        existing.urgency = analysis.urgency;
        existing.severity = analysis.severity;
      }

      // Handle Resources
      const newResources = Array.from(
        new Set([...existing.resources, ...analysis.resources])
      );
      if (newResources.length > existing.resources.length) {
        const added = newResources.filter(
          (r) => !existing.resources.includes(r)
        );
        const changeEntry: WhatChangedEntry = {
          id: `wc-${Date.now()}-${Math.random()}`,
          timestamp: signal.timestamp,
          type: 'resource',
          label: 'Emergency Resources Recommended',
          detail: `AI advised addition of: ${added.join(', ')} (Human approval required)`,
          sourceSignalId: signal.id,
        };
        existing.whatChanged = [changeEntry, ...existing.whatChanged];
        existing.resources = newResources;
      }

      // Handle Status Updates (Rescue In Progress / Resolved)
      if (analysis.status !== existing.status && analysis.status !== 'unverified') {
        const changeEntry: WhatChangedEntry = {
          id: `wc-${Date.now()}-${Math.random()}`,
          timestamp: signal.timestamp,
          type: 'status',
          label: 'Operational Status Updated',
          from: existing.status.replace(/_/g, ' ').toUpperCase(),
          to: analysis.status.replace(/_/g, ' ').toUpperCase(),
          sourceSignalId: signal.id,
          detail:
            analysis.status === 'resolved'
              ? '✓ Everyone evacuated and accounted for. Incident resolved.'
              : '✓ Rescue team reached location. Active extraction underway.',
        };
        existing.whatChanged = [changeEntry, ...existing.whatChanged];
        existing.status = analysis.status;
      }

      // Update location landmarks if new ones were detected
      if (analysis.location.landmarks.length > 0) {
        existing.location.landmarks = Array.from(
          new Set([...existing.location.landmarks, ...analysis.location.landmarks])
        );
      }

      globalStore.incidents[existingIndex] = existing;
      persistStoreToFile();
      return {
        incident: existing,
        analysis,
        isNewIncident: false,
        isNoise: false,
      };
    }
  }

  // Create NEW Incident
  const incNum = String(globalStore.incidents.length + 1).padStart(3, '0');
  const newIncidentId = `INC-${incNum}`;

  const initialChange: WhatChangedEntry = {
    id: `wc-${Date.now()}`,
    timestamp: signal.timestamp,
    type: 'note',
    label: 'Incident Record Created',
    detail: `Initial signal ingested via ${signal.source.replace('_', ' ').toUpperCase()} from ${signal.sender}`,
    sourceSignalId: signal.id,
  };

  const newIncident: Incident = {
    id: newIncidentId,
    title: `${analysis.incidentType.toUpperCase()} - ${analysis.location.landmarks[0] || analysis.location.area || 'Metro Sector'}`,
    incidentType: analysis.incidentType,
    classification: analysis.classification,
    location: analysis.location,
    people: analysis.people,
    peopleHistory:
      analysis.people.affected !== null
        ? [
            {
              count: analysis.people.affected,
              timestamp: signal.timestamp,
              label: 'Initial report',
            },
          ]
        : [],
    urgency: analysis.urgency,
    severity: analysis.severity,
    status: analysis.status,
    resources: analysis.resources,
    confidence: analysis.confidence,
    uncertainties: analysis.uncertainties,
    evidence: analysis.evidence,
    signals: [signal],
    whatChanged: [initialChange],
    createdAt: signal.timestamp,
    updatedAt: signal.timestamp,
    conflictCount: 0,
    aiExplanations: analysis.explanations,
    isDemoRecord: Boolean(signal.isDemoConnector),
    summary: analysis.summary,
    notes: [],
  };

  globalStore.incidents = [newIncident, ...globalStore.incidents];
  persistStoreToFile();

  return {
    incident: newIncident,
    analysis,
    isNewIncident: true,
    isNoise: false,
  };
}

/**
 * Updates operational status of an incident (responder command)
 */
export function updateIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  responderNotes?: string
): Incident | null {
  const store = getStore();
  const index = store.incidents.findIndex((i) => i.id === incidentId);
  if (index === -1) return null;

  const existing = { ...store.incidents[index] };
  const prevStatus = existing.status;
  existing.status = newStatus;
  existing.updatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const changeEntry: WhatChangedEntry = {
    id: `wc-${Date.now()}`,
    timestamp: existing.updatedAt,
    type: 'status',
    label: 'Responder Operational Status Update',
    from: prevStatus.replace(/_/g, ' ').toUpperCase(),
    to: newStatus.replace(/_/g, ' ').toUpperCase(),
    detail: responderNotes || `Operational status transitioned to ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
  };

  existing.whatChanged = [changeEntry, ...existing.whatChanged];

  if (responderNotes) {
    existing.notes = [
      {
        id: `note-${Date.now()}`,
        timestamp: existing.updatedAt,
        author: 'Field Responder / Dispatcher',
        text: responderNotes,
      },
      ...(existing.notes || []),
    ];
  }

  store.incidents[index] = existing;
  persistStoreToFile();
  return existing;
}

/**
 * Adds an operational responder note
 */
export function addResponderNote(
  incidentId: string,
  author: string,
  text: string
): Incident | null {
  const store = getStore();
  const index = store.incidents.findIndex((i) => i.id === incidentId);
  if (index === -1) return null;

  const existing = { ...store.incidents[index] };
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const note = {
    id: `note-${Date.now()}`,
    timestamp,
    author: author || 'Field Responder',
    text,
  };

  existing.notes = [note, ...(existing.notes || [])];
  existing.updatedAt = timestamp;
  store.incidents[index] = existing;
  persistStoreToFile();
  return existing;
}

/**
 * Generates an RFC 4180 compliant CSV of all stored incidents
 */
export function generateIncidentsCsv(): string {
  const store = getStore();
  const headers = [
    'Incident ID',
    'Title',
    'Type',
    'Classification',
    'Urgency',
    'Status',
    'People Affected',
    'Trapped',
    'Vulnerable Individuals',
    'Normalized Location',
    'Landmarks',
    'Clustered Signals Count',
    'Record Type',
    'Created At',
    'Updated At',
    'AI Responder Summary',
  ];

  function escapeCsv(val: any): string {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  const rows = store.incidents.map((inc) => [
    escapeCsv(inc.id),
    escapeCsv(inc.title),
    escapeCsv(inc.incidentType),
    escapeCsv(inc.classification),
    escapeCsv(inc.urgency),
    escapeCsv(inc.status),
    escapeCsv(inc.people.affected ?? 'Unknown'),
    escapeCsv(inc.people.trapped ?? 'Unknown'),
    escapeCsv(
      inc.people.vulnerable.map((v) => `${v.type}: ${v.details}`).join('; ') || 'None'
    ),
    escapeCsv(inc.location.normalized),
    escapeCsv(inc.location.landmarks.join(', ')),
    escapeCsv(inc.signals.length),
    escapeCsv(inc.isDemoRecord ? 'DEMO SIMULATION' : 'REAL INCIDENT'),
    escapeCsv(inc.createdAt),
    escapeCsv(inc.updatedAt),
    escapeCsv(inc.summary?.responderBrief || inc.aiExplanations?.whyCritical || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Loads the full 52-report benchmark dataset sequentially
 */
export async function seedFullBenchmarkDataset(): Promise<void> {
  resetStore();
  for (const report of FULL_DEMO_REPORTS) {
    const signal: EmergencySignal = {
      id: report.id,
      source: report.source,
      sender: report.sender,
      rawText: report.rawText,
      language: report.language,
      timestamp: report.timestamp,
      isDemoConnector: true,
    };
    await ingestSignal(signal);
  }
}
