'use client';

import React from 'react';
import { Incident, EmergencySignal } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Layers,
  FilterX,
  FileText,
  Shield,
  Activity,
} from 'lucide-react';

interface AnalyticsViewProps {
  incidents: Incident[];
  rawReports: EmergencySignal[];
  noiseCount: number;
}

export default function AnalyticsView({
  incidents,
  rawReports,
  noiseCount,
}: AnalyticsViewProps) {
  // 1. Incidents by Type data
  const typeCounts: Record<string, number> = {};
  incidents.forEach((inc) => {
    typeCounts[inc.incidentType] = (typeCounts[inc.incidentType] || 0) + 1;
  });
  const typeData = Object.entries(typeCounts).map(([name, count]) => ({
    name: name.toUpperCase(),
    count,
  }));

  // 2. Urgency Breakdown
  const urgencyCounts = {
    critical: incidents.filter((i) => i.urgency === 'critical').length,
    high: incidents.filter((i) => i.urgency === 'high').length,
    medium: incidents.filter((i) => i.urgency === 'medium').length,
    low: incidents.filter((i) => i.urgency === 'low').length,
  };
  const urgencyData = [
    { name: 'Critical', value: urgencyCounts.critical, color: '#ef4444' },
    { name: 'High', value: urgencyCounts.high, color: '#f59e0b' },
    { name: 'Medium', value: urgencyCounts.medium, color: '#3b82f6' },
    { name: 'Low', value: urgencyCounts.low, color: '#64748b' },
  ].filter((d) => d.value > 0);

  // 3. Status Breakdown
  const statusCounts = {
    active: incidents.filter((i) => i.status === 'active').length,
    rescue_in_progress: incidents.filter((i) => i.status === 'rescue_in_progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
  };
  const statusData = [
    { name: 'Active', value: statusCounts.active, color: '#f59e0b' },
    { name: 'In Progress', value: statusCounts.rescue_in_progress, color: '#3b82f6' },
    { name: 'Resolved', value: statusCounts.resolved, color: '#10b981' },
  ].filter((d) => d.value > 0);

  // 4. Source Channels Breakdown
  const sourceCounts: Record<string, number> = {};
  rawReports.forEach((sig) => {
    const formatted = sig.source.replace('_', ' ').toUpperCase();
    sourceCounts[formatted] = (sourceCounts[formatted] || 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const totalRaw = rawReports.length;
  const duplicates = Math.max(0, totalRaw - incidents.length - noiseCount);

  return (
    <div className="space-y-6">
      {/* Top Banner Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 uppercase font-medium">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Total Ingested
          </span>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalRaw}</div>
          <span className="text-[10px] text-slate-500">Across all channels</span>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-900/60">
          <span className="text-xs text-purple-300 flex items-center gap-1.5 uppercase font-medium">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Clustered Duplicates
          </span>
          <div className="text-2xl font-black text-purple-300 font-mono mt-1">{duplicates}</div>
          <span className="text-[10px] text-purple-400 font-mono">Consolidated by Gemini</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60">
          <span className="text-xs text-rose-300 flex items-center gap-1.5 uppercase font-medium">
            <FilterX className="w-3.5 h-3.5 text-rose-400" /> Noise Filtered
          </span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">{noiseCount}</div>
          <span className="text-[10px] text-rose-400">Non-emergencies discarded</span>
        </div>

        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-900/60">
          <span className="text-xs text-cyan-300 flex items-center gap-1.5 uppercase font-medium">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Synthesized Incidents
          </span>
          <div className="text-2xl font-black text-cyan-300 font-mono mt-1">{incidents.length}</div>
          <span className="text-[10px] text-cyan-400">Clear operational pictures</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Incidents by Category */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Incidents By Category
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">ONE AI BRAIN</span>
          </div>

          <div className="h-64 w-full">
            {typeData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No incidents loaded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Signal Ingestion Sources */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Signal Source Ingestion Volume
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">MULTI-CHANNEL</span>
          </div>

          <div className="h-64 w-full">
            {sourceData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No signals loaded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: Urgency Distribution */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Urgency Distribution
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            {urgencyData.length === 0 ? (
              <span className="text-xs text-slate-500">No data available</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={urgencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {urgencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Operational Status */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Operational Lifecycle Status
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            {statusData.length === 0 ? (
              <span className="text-xs text-slate-500">No data available</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
