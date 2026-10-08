import { NextResponse } from 'next/server';
import { LIVE_DEMO_SEQUENCE } from '@/lib/data/dataset';
import { ingestSignal, getStore, resetStore } from '@/lib/store/incident-store';
import { EmergencySignal } from '@/types';

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    sequence: LIVE_DEMO_SEQUENCE,
    currentStep: store.activeDemoStep,
    totalSteps: LIVE_DEMO_SEQUENCE.length,
    incidents: store.incidents,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, stepIndex } = body;

    const store = getStore();

    if (action === 'reset') {
      resetStore();
      return NextResponse.json({
        success: true,
        message: 'Live demo reset to step 0',
        currentStep: 0,
        incidents: [],
      });
    }

    const targetStep =
      typeof stepIndex === 'number' ? stepIndex : store.activeDemoStep + 1;

    if (targetStep < 1 || targetStep > LIVE_DEMO_SEQUENCE.length) {
      return NextResponse.json(
        { error: 'Step out of range (1-6)' },
        { status: 400 }
      );
    }

    const stepData = LIVE_DEMO_SEQUENCE[targetStep - 1];

    const signal: EmergencySignal = {
      id: `DEMO-SIG-${targetStep}`,
      source: stepData.source,
      sender: stepData.sender,
      rawText: stepData.message,
      language: stepData.language,
      timestamp: stepData.time,
      isDemoConnector: true,
    };

    const ingestionResult = await ingestSignal(signal);
    store.activeDemoStep = targetStep;

    return NextResponse.json({
      success: true,
      currentStep: targetStep,
      stepData,
      ingestionResult,
      incidents: store.incidents,
      isComplete: targetStep === LIVE_DEMO_SEQUENCE.length,
    });
  } catch (error: any) {
    console.error('Error in /api/demo:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to advance demo step' },
      { status: 500 }
    );
  }
}
