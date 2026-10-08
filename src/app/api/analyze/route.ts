import { NextResponse } from 'next/server';
import { analyzeEmergencySignal } from '@/lib/ai/gemini';
import { EmergencySignal, Incident } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { signal, existingIncidents } = body as {
      signal: EmergencySignal;
      existingIncidents?: Incident[];
    };

    if (!signal || !signal.rawText) {
      return NextResponse.json(
        { error: 'Invalid input. Signal and rawText are required.' },
        { status: 400 }
      );
    }

    const analysis = await analyzeEmergencySignal(
      signal,
      existingIncidents || []
    );

    return NextResponse.json({
      success: true,
      data: analysis,
      aiModel: 'Google Gemini (One AI Brain)',
    });
  } catch (error: any) {
    console.error('Error analyzing signal:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze emergency signal' },
      { status: 500 }
    );
  }
}
