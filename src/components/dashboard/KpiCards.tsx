'use client';

import React from 'react';
import {
  AlertTriangle,
  Flame,
  Users,
  LifeBuoy,
  CheckCircle2,
  HelpCircle,
  Layers,
  FilterX,
  FileText,
} from 'lucide-react';

interface KpiCardsProps {
  stats: {
    activeIncidents: number;
    critical: number;
    peopleAffected: number;
    rescueInProgress: number;
    resolved: number;
    unverified: number;
    totalRaw: number;
    noiseCount: number;
    incidentCount: number;
    duplicates: number;
  };
}

export default function KpiCards({ stats }: KpiCardsProps) {
  return (
    <div className="space-y-3">
      {/* Primary Operational KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Active Incidents */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats.activeIncidents}
            </span>
            <span className="text-[10px] text-amber-400 font-medium">In Field</span>
          </div>
        </div>

        {/* Critical */}
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 hover:border-red-700 transition shadow-lg shadow-red-950/20">
          <div className="flex items-center justify-between text-red-300">
            <span className="text-xs font-bold uppercase tracking-wider">Critical</span>
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
              {stats.critical}
            </span>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wide">
              Priority 1
            </span>
          </div>
        </div>

        {/* People Affected */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">People Affected</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats.peopleAffected}
            </span>
            <span className="text-[10px] text-cyan-400 font-medium">Reported</span>
          </div>
        </div>

        {/* Rescue In Progress */}
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 hover:border-blue-700 transition shadow-lg">
          <div className="flex items-center justify-between text-blue-300">
            <span className="text-xs font-medium uppercase tracking-wider">In Progress</span>
            <LifeBuoy className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-300 font-mono">
              {stats.rescueInProgress}
            </span>
            <span className="text-[10px] text-blue-400 font-medium">Underway</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 hover:border-emerald-700 transition shadow-lg">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-xs font-medium uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {stats.resolved}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Secured</span>
          </div>
        </div>

        {/* Unverified */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Unverified</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-300 font-mono">
              {stats.unverified}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Awaiting Recon</span>
          </div>
        </div>
      </div>

      {/* Triage Synthesis Bar: Shows Signal Reduction Power */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">AI Signal Synthesis Ratio:</span>
          <span>From {stats.totalRaw} scattered raw signals → {stats.incidentCount} synthesized incidents</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <strong className="text-white">{stats.totalRaw}</strong> Ingested
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <strong className="text-purple-400">{stats.duplicates}</strong> Clustered Duplicates
          </span>
          <span className="flex items-center gap-1.5">
            <FilterX className="w-3.5 h-3.5 text-rose-400" />
            <strong className="text-rose-400">{stats.noiseCount}</strong> Noise Filtered
          </span>
        </div>
      </div>
    </div>
  );
}
