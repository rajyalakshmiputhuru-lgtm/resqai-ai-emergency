'use client';

import React, { useState, useMemo } from 'react';
import {
  Incident,
  IncidentType,
  UrgencyLevel,
  IncidentStatus,
} from '@/types';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Waves,
  HeartPulse,
  Car,
  Building,
  AlertOctagon,
  Users,
  Shield,
  Clock,
  CheckCircle2,
  HelpCircle,
  Radio,
  Layers,
  MapPin,
} from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export default function IncidentList({
  incidents,
  selectedIncident,
  onSelectIncident,
}: IncidentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'updated' | 'people'>('urgency');

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesId = inc.id.toLowerCase().includes(q);
          const matchesType = inc.incidentType.toLowerCase().includes(q);
          const matchesLoc = inc.location.normalized.toLowerCase().includes(q);
          const matchesLandmarks = inc.location.landmarks.some((l) =>
            l.toLowerCase().includes(q)
          );
          if (!matchesId && !matchesType && !matchesLoc && !matchesLandmarks) {
            return false;
          }
        }

        // Status filter
        if (statusFilter === 'active' && inc.status !== 'active' && inc.status !== 'rescue_in_progress') {
          return false;
        }
        if (statusFilter === 'critical' && inc.urgency !== 'critical') {
          return false;
        }
        if (statusFilter === 'rescue_in_progress' && inc.status !== 'rescue_in_progress') {
          return false;
        }
        if (statusFilter === 'resolved' && inc.status !== 'resolved') {
          return false;
        }
        if (statusFilter === 'unverified' && inc.status !== 'unverified') {
          return false;
        }

        // Type filter
        if (typeFilter !== 'all' && inc.incidentType !== typeFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          const urgencyOrder: Record<UrgencyLevel, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        }
        if (sortBy === 'people') {
          return (b.people.affected || 0) - (a.people.affected || 0);
        }
        // default: updated
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [incidents, searchQuery, statusFilter, typeFilter, sortBy]);

  function getTypeIcon(type: IncidentType) {
    switch (type) {
      case 'flood':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'medical':
        return <HeartPulse className="w-4 h-4 text-red-400" />;
      case 'accident':
        return <Car className="w-4 h-4 text-amber-400" />;
      case 'evacuation':
        return <Building className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertOctagon className="w-4 h-4 text-slate-400" />;
    }
  }

  function getUrgencyBadge(urgency: UrgencyLevel) {
    switch (urgency) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-red-950/90 text-red-400 border border-red-700/80 animate-pulse">
            <Flame className="w-3 h-3 text-red-500" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-700">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
            LOW
          </span>
        );
    }
  }

  function getStatusBadge(status: IncidentStatus) {
    switch (status) {
      case 'rescue_in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-950 text-blue-300 border border-blue-800">
            <Shield className="w-2.5 h-2.5" /> Rescue in Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-2.5 h-2.5" /> Resolved
          </span>
        );
      case 'unverified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-950 text-amber-300 border border-amber-800">
            <HelpCircle className="w-2.5 h-2.5" /> Unverified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
            <Radio className="w-2.5 h-2.5 text-cyan-400" /> Active
          </span>
        );
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Header & Search */}
      <div className="p-3.5 border-b border-slate-800/80 space-y-3 bg-slate-950/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Synthesized Incidents
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-cyan-400 border border-slate-700">
              {filteredIncidents.length} / {incidents.length}
            </span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="urgency">Highest Urgency</option>
              <option value="people">Most People</option>
              <option value="updated">Latest Update</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, landmark, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          {[
            { id: 'all', label: 'All' },
            { id: 'critical', label: 'Critical' },
            { id: 'active', label: 'Active' },
            { id: 'rescue_in_progress', label: 'Rescue In Progress' },
            { id: 'resolved', label: 'Resolved' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition font-medium ${
                statusFilter === pill.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[620px]">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <AlertOctagon className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs">No incidents matching current criteria.</p>
            <p className="text-[11px] text-slate-600">
              Try clicking &quot;START LIVE DEMO&quot; or &quot;LOAD DEMO DATA&quot;.
            </p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const isCritical = incident.urgency === 'critical';

            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                    : isCritical
                    ? 'bg-slate-950 hover:bg-slate-900/70 border-red-900/60 hover:border-red-700'
                    : 'bg-slate-950 hover:bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Row: ID, Type, Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                      {incident.id}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold uppercase text-slate-300">
                      {getTypeIcon(incident.incidentType)}
                      {incident.incidentType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getUrgencyBadge(incident.urgency)}
                    {getStatusBadge(incident.status)}
                  </div>
                </div>

                {/* Location & Landmark intelligence */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-100 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{incident.location.normalized}</span>
                  </div>

                  {/* Approximate Location badge */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/70 font-mono">
                      📍 APPROXIMATE LOCATION ({Math.round((incident.location.confidence || 0.85) * 100)}%)
                    </span>
                    {incident.location.landmarks.slice(0, 2).map((l, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* People & Vulnerable individuals */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <strong className="text-white">
                        {incident.people.affected ?? 'Unspecified'}
                      </strong>
                      <span>people</span>
                    </span>

                    {/* Vulnerable pill */}
                    {incident.people.vulnerable.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800 font-medium">
                        ⚠ {incident.people.vulnerable.length} Vulnerable ({incident.people.vulnerable[0].type})
                      </span>
                    )}
                  </div>

                  {/* Signal clustering badge */}
                  <div className="flex items-center gap-1 text-[11px] text-purple-400 font-mono">
                    <Layers className="w-3 h-3 text-purple-400" />
                    <span>{incident.signals.length} signals clustered</span>
                  </div>
                </div>

                {/* Conflict badge if recorded */}
                {incident.conflictCount > 0 && (
                  <div className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-900/60 rounded px-2 py-0.5 flex items-center justify-between">
                    <span>⚠ Conflicting count resolved in timeline ({incident.conflictCount} revision)</span>
                    <span className="font-mono font-bold">LATEST: {incident.people.affected}</span>
                  </div>
                )}

                {/* Footer: Resources & Time */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                    <Shield className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {incident.resources.slice(0, 2).join(', ') || 'Standard dispatch'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{incident.updatedAt}</span>
                    <span className="text-cyan-400">({Math.round((incident.confidence || 0.9) * 100)}% AI Conf)</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
