import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store/incident-store';

const START_TIME = Date.now();

export async function GET() {
  const store = getStore();
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(
    apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here'
  );

  const activeCount = store.incidents.filter(
    (i) => i.status === 'active' || i.status === 'rescue_in_progress' || i.status === 'responding'
  ).length;

  const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);

  return NextResponse.json({
    status: 'healthy',
    service: 'ResQAI – AI Emergency Response Assistant',
    tagline: 'From scattered signals to one clear emergency.',
    version: '1.2.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    environment: process.env.NODE_ENV || 'production',
    ai: {
      provider: 'Google Gemini API',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      isApiKeyConfigured: isKeyConfigured,
      executionMode: isKeyConfigured ? 'live_gemini' : 'simulated_engine',
      singleModelArchitecture: 'Strict Single-AI Architecture (No secondary models or LLM agents)',
    },
    telemetry: {
      storage: 'persistent_json_store',
      totalIncidents: store.incidents.length,
      activeIncidents: activeCount,
      totalRawSignals: store.rawReports.length,
      noiseFiltered: store.noiseReports.length,
      unverifiedReports: store.unverifiedReports.length,
    },
    safetyDisclaimer:
      'ResQAI provides AI decision-support intelligence. It does NOT autonomously dispatch emergency services. Human authorization is mandatory for tactical actions.',
  });
}
