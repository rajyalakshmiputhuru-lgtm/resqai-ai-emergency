import { NextResponse } from 'next/server';
import {
  getStore,
  ingestSignal,
  seedFullBenchmarkDataset,
  resetStore,
  updateIncidentStatus,
  addResponderNote,
  generateIncidentsCsv,
} from '@/lib/store/incident-store';
import { VERIFIED_EMERGENCY_CONTACTS } from '@/lib/data/emergency-directory';
import { EmergencySignal } from '@/types';

function computeStats(store: ReturnType<typeof getStore>) {
  const activeIncidents = store.incidents.filter(
    (i) =>
      i.status === 'active' ||
      i.status === 'rescue_in_progress' ||
      i.status === 'responding' ||
      i.status === 'submitted' ||
      i.status === 'reviewing'
  ).length;

  const critical = store.incidents.filter((i) => i.urgency === 'critical').length;

  const peopleAffected = store.incidents.reduce(
    (acc, curr) => acc + (curr.people.affected || 0),
    0
  );

  const rescueInProgress = store.incidents.filter(
    (i) => i.status === 'rescue_in_progress' || i.status === 'responding'
  ).length;

  const resolved = store.incidents.filter((i) => i.status === 'resolved').length;

  const unverified =
    store.incidents.filter((i) => i.status === 'unverified').length +
    store.unverifiedReports.length;

  const totalRaw = store.rawReports.length;
  const noiseCount = store.noiseReports.length;
  const incidentCount = store.incidents.length;
  const duplicates = Math.max(0, totalRaw - incidentCount - noiseCount);

  return {
    activeIncidents,
    critical,
    peopleAffected,
    rescueInProgress,
    resolved,
    unverified,
    totalRaw,
    noiseCount,
    incidentCount,
    duplicates,
  };
}

export async function GET() {
  const store = getStore();
  const stats = computeStats(store);

  return NextResponse.json({
    success: true,
    incidents: store.incidents,
    rawReports: store.rawReports.slice(0, 40),
    noiseReports: store.noiseReports,
    lastAnalysis: store.lastAnalysis,
    emergencyContacts: VERIFIED_EMERGENCY_CONTACTS,
    stats,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, signal, incidentId, status, responderNotes, author, text } = body;

    // 1. Seed Benchmark Dataset
    if (action === 'seed_full') {
      await seedFullBenchmarkDataset();
      const store = getStore();
      return NextResponse.json({
        success: true,
        message: 'Loaded full 52-report benchmark dataset',
        incidents: store.incidents,
        stats: computeStats(store),
      });
    }

    // 2. Reset
    if (action === 'reset') {
      resetStore();
      const store = getStore();
      return NextResponse.json({
        success: true,
        message: 'Reset all incidents and signals',
        incidents: store.incidents,
        stats: computeStats(store),
      });
    }

    // 3. Update Incident Status
    if (action === 'update_status') {
      if (!incidentId || !status) {
        return NextResponse.json(
          { error: 'incidentId and status are required' },
          { status: 400 }
        );
      }
      const updated = updateIncidentStatus(incidentId, status, responderNotes);
      if (!updated) {
        return NextResponse.json(
          { error: `Incident ${incidentId} not found` },
          { status: 404 }
        );
      }
      const store = getStore();
      return NextResponse.json({
        success: true,
        incident: updated,
        incidents: store.incidents,
        stats: computeStats(store),
      });
    }

    // 4. Add Responder Note
    if (action === 'add_note') {
      if (!incidentId || !text) {
        return NextResponse.json(
          { error: 'incidentId and text are required' },
          { status: 400 }
        );
      }
      const updated = addResponderNote(incidentId, author || 'Responder', text);
      if (!updated) {
        return NextResponse.json(
          { error: `Incident ${incidentId} not found` },
          { status: 404 }
        );
      }
      const store = getStore();
      return NextResponse.json({
        success: true,
        incident: updated,
        incidents: store.incidents,
      });
    }

    // 5. Export CSV
    if (action === 'export_csv') {
      const csvData = generateIncidentsCsv();
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="resqai-incidents-${Date.now()}.csv"`,
        },
      });
    }

    // 6. Ingest Signal (Citizen Report or Field Radio)
    if (!signal || !signal.rawText) {
      return NextResponse.json(
        { error: 'Valid signal object with rawText is required' },
        { status: 400 }
      );
    }

    const preparedSignal: EmergencySignal = {
      id: signal.id || `SIG-${Date.now()}`,
      source: signal.source || 'manual',
      sender: signal.sender || 'Direct Ingestion',
      rawText: signal.rawText,
      language: signal.language || 'English',
      timestamp:
        signal.timestamp ||
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemoConnector: signal.isDemoConnector ?? false,
    };

    const result = await ingestSignal(preparedSignal);
    const store = getStore();

    return NextResponse.json({
      success: true,
      ...result,
      incidents: store.incidents,
      stats: computeStats(store),
    });
  } catch (error: any) {
    console.error('API Error in /api/incidents:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process signal' },
      { status: 500 }
    );
  }
}
