'use client';

import React, { useState } from 'react';
import { Incident, EmergencySignal } from '@/types';
import {
  History,
  Sparkles,
  Radio,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface BottomPanelProps {
  selectedIncident: Incident | null;
  allIncidents: Incident[];
  rawReports: EmergencySignal[];
}

export default function BottomPanel({
  selectedIncident,
  allIncidents,
  rawReports,
}: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState<'what_changed' | 'ai_evidence' | 'signals'>('what_changed');

  // Display either selected incident's changes or aggregate across all incidents
  const whatChangedEntries = selectedIncident
    ? selectedIncident.whatChanged
    : allIncidents.flatMap((inc) =>
        inc.whatChanged.map((wc) => ({ ...wc, incidentId: inc.id }))
      );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl space-y-4">
      {/* Tab Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('what_changed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'what_changed'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-600/50 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>WHAT CHANGED TIMELINE</span>
            {selectedIncident && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200">
                {selectedIncident.id}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai_evidence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'ai_evidence'
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-600/50 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI EVIDENCE & EXPLANATIONS</span>
          </button>

          <button
            onClick={() => setActiveTab('signals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'signals'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-600/50 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>RAW SIGNALS STREAM ({rawReports.length})</span>
          </button>
        </div>

        {selectedIncident && (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Inspecting:</span>
            <strong className="text-white font-mono">{selectedIncident.id}</strong>
            <span className="text-slate-500">•</span>
            <span>{selectedIncident.title}</span>
          </div>
        )}
      </div>

      {/* TAB 1: WHAT CHANGED */}
      {activeTab === 'what_changed' && (
        <div className="space-y-2">
          {whatChangedEntries.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No state change events recorded yet. Ingest signals or run live demo.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {whatChangedEntries.slice(0, 9).map((entry: any, idx) => (
                <div
                  key={entry.id || idx}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5 transition hover:border-slate-700"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {entry.timestamp}
                    </span>
                    {entry.incidentId && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300">
                        {entry.incidentId}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    {entry.type === 'people' && (
                      <span className="text-amber-400">⚠ {entry.label}</span>
                    )}
                    {entry.type === 'urgency' && (
                      <span className="text-rose-400">🔥 {entry.label}</span>
                    )}
                    {entry.type === 'vulnerable' && (
                      <span className="text-rose-300">+ {entry.label}</span>
                    )}
                    {entry.type === 'resource' && (
                      <span className="text-cyan-300">+ {entry.label}</span>
                    )}
                    {entry.type === 'status' && (
                      <span className="text-emerald-400">✓ {entry.label}</span>
                    )}
                    {entry.type === 'note' && (
                      <span className="text-slate-300">ℹ {entry.label}</span>
                    )}
                  </div>

                  {/* Diff representation */}
                  {entry.from !== undefined && entry.to !== undefined && (
                    <div className="flex items-center gap-2 font-mono text-[11px] bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400 line-through">{String(entry.from)}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-300 font-bold">{String(entry.to)}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {entry.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI EVIDENCE & EXPLANATIONS */}
      {activeTab === 'ai_evidence' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Why Same Incident? */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  WHY SAME INCIDENT?
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  94% Overall Match
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedIncident?.aiExplanations?.whySameIncident ||
                  "Identified matching landmark cluster (94% confidence) and contiguous flood/disaster sector. Signals share spatial centroid within 300m."}
              </p>

              {/* Similarity Factors Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Landmark match:</span>
                  <strong className="text-cyan-300 font-mono">94%</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '94%' }} />
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Location context:</span>
                  <strong className="text-cyan-300 font-mono">90%</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '90%' }} />
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Semantic similarity:</span>
                  <strong className="text-cyan-300 font-mono">92%</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '92%' }} />
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Time compatibility:</span>
                  <strong className="text-cyan-300 font-mono">95%</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
            </div>

            {/* Box 2: Why Critical? */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide">
                  WHY CRITICAL?
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800">
                  P1 Emergency
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedIncident?.aiExplanations?.whyCritical ||
                  "Elevated to CRITICAL due to: 10 people trapped on terrace/ground floor, vulnerable elderly person identified inside, and rising water level threatening occupants."}
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-red-400 font-bold">•</span>
                  <span>10 people trapped in rising floodwaters</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Water rising rapidly (kinetic hazard)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Elderly vulnerable person requiring medical support</span>
                </div>
              </div>
            </div>

            {/* Box 3: Why Approximate Location? */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  WHY APPROXIMATE LOCATION?
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                  87% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedIncident?.aiExplanations?.whyApproximateLocation ||
                  "Report references descriptive urban landmarks ('Velachery MRTS west gate', 'behind station Vijayanagar side') rather than GPS coordinates. ResQAI pins approximate landmark centroid and avoids false precision."}
              </p>
              <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                <div>Landmark Available: <span className="text-emerald-400">YES</span></div>
                <div>Exact GPS Telemetry: <span className="text-amber-400">NO (Synthesized)</span></div>
                <div>Perimeter Bound: <span className="text-cyan-400">500m Landmark Buffer</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RAW SIGNALS STREAM */}
      {activeTab === 'signals' && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {rawReports.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No signals ingested yet.
            </div>
          ) : (
            <div className="space-y-2">
              {rawReports.slice(0, 10).map((signal) => (
                <div
                  key={signal.id}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {signal.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {signal.source.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        From: <strong className="text-slate-300">{signal.sender}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {signal.timestamp}
                      </span>
                      {signal.language && (
                        <span className="text-[10px] px-1.5 rounded bg-slate-800 text-amber-300">
                          {signal.language}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 text-xs italic font-serif">
                      &ldquo;{signal.rawText}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
