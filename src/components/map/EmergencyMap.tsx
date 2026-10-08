'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Incident } from '@/types';
import { Loader2 } from 'lucide-react';

const EmergencyMapInner = dynamic(
  () => import('./EmergencyMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
        <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
          Loading Geospatial Intelligence Map...
        </span>
      </div>
    ),
  }
);

interface EmergencyMapProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export default function EmergencyMap(props: EmergencyMapProps) {
  return <EmergencyMapInner {...props} />;
}
