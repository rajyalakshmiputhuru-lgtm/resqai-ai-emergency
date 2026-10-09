import { NextResponse } from 'next/server';
import { generateIncidentsCsv } from '@/lib/store/incident-store';

export async function GET() {
  const csvData = generateIncidentsCsv();
  return new NextResponse(csvData, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="resqai-incidents-${Date.now()}.csv"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
