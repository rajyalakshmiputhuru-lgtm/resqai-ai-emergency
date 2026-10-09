'use client';

import React, { useState, useMemo } from 'react';
import {
  Incident,
  IncidentStatus,
  UrgencyLevel,
  ActionChecklistItem,
} from '@/types';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Flame,
  LifeBuoy,
  MessageSquare,
  ArrowRight,
  Send,
  Sparkles,
} from 'lucide-react';

interface ResponderViewProps {
  incidents: Incident[];
  onStatusUpdated: () => void;
  onSelectIncidentOnMap: (incident: Incident) => void;
}

export default function ResponderView({
  incidents,
  onStatusUpdated,
  onSelectIncidentOnMap,
}: ResponderViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    incidents[0]?.id || null
  );

  const [responderNoteText, setResponderNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [completedChecklistSteps, setCompletedChecklistSteps] = useState<Record<string, boolean>>({});

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = inc.id.toLowerCase().includes(q);
        const matchesLoc = inc.location.normalized.toLowerCase().includes(q);
        const matchesType = inc.incidentType.toLowerCase().includes(q);
        if (!matchesId && !matchesLoc && !matchesType) return false;
      }

      if (statusFilter !== 'all') {
        if (statusFilter === 'active' && inc.status !== 'active' && inc.status !== 'submitted') {
          return false;
        }
        if (
          statusFilter === 'responding' &&
          inc.status !== 'responding' &&
          inc.status !== 'rescue_in_progress'
        ) {
          return false;
        }
        if (statusFilter === 'resolved' && inc.status !== 'resolved') {
          return false;
        }
        if (statusFilter === 'unverified' && inc.status !== 'unverified') {
          return false;
        }
      }

      if (urgencyFilter !== 'all' && inc.urgency !== urgencyFilter) {
        return false;
      }

      return true;
    });
  }, [incidents, searchQuery, statusFilter, urgencyFilter]);

  const activeIncident = useMemo(() => {
    return (
      incidents.find((i) => i.id === selectedIncidentId) ||
      filteredIncidents[0] ||
      null
    );
  }, [incidents, selectedIncidentId, filteredIncidents]);

  async function handleStatusChange(incidentId: string, newStatus: IncidentStatus) {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          incidentId,
          status: newStatus,
          responderNotes: `Status changed to ${newStatus.replace(/_/g, ' ').toUpperCase()} by Field Dispatcher`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onStatusUpdated();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!activeIncident || !responderNoteText.trim()) return;
    setIsSubmittingNote(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_note',
          incidentId: activeIncident.id,
          author: 'Command Responder',
          text: responderNoteText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResponderNoteText('');
        onStatusUpdated();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  }

  function handleCopyBrief() {
    if (!activeIncident) return;
    const brief =
      activeIncident.summary?.responderBrief ||
      `${activeIncident.id} ${activeIncident.urgency.toUpperCase()} ${activeIncident.incidentType.toUpperCase()} at ${activeIncident.location.normalized}. ${activeIncident.people.affected ?? 0} people affected.`;
    navigator.clipboard.writeText(brief);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  }

  function handleExportCsv() {
    window.open('/api/export', '_blank');
  }

  function toggleChecklistStep(key: string) {
    setCompletedChecklistSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1226] to-slate-950 border border-cyan-800/60 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono mb-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>TACTICAL RESPONDER COMMAND INTERFACE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
            Incident Operations Desk
          </h2>
          <p className="text-xs text-slate-400">
            Field responder triage, live operational status management, and mission checklists.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition shadow"
            title="Download full incident registry as CSV"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filterable Incident Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Triage Queue ({filteredIncidents.length})
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ID, landmark, or category..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Status & Urgency Filter Selectors */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active / Submitted</option>
                <option value="responding">Responding / In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="unverified">Unverified</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Urgency</option>
                <option value="critical">Critical (P1)</option>
                <option value="high">High (P2)</option>
                <option value="medium">Medium (P3)</option>
                <option value="low">Low (P4)</option>
              </select>
            </div>
          </div>

          {/* Incident Queue Scrollable Cards */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                No incidents match the active filter criteria.
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = activeIncident?.id === incident.id;
                const isCritical = incident.urgency === 'critical';

                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-900/95 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                        : isCritical
                        ? 'bg-slate-950 hover:bg-slate-900/60 border-red-900/50 hover:border-red-700'
                        : 'bg-slate-950 hover:bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                          {incident.id}
                        </span>
                        <span className="text-xs font-semibold uppercase text-slate-300">
                          {incident.incidentType}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            incident.urgency === 'critical'
                              ? 'bg-red-950 text-red-400 border border-red-700'
                              : 'bg-amber-950 text-amber-400 border border-amber-700'
                          }`}
                        >
                          {incident.urgency}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            incident.isDemoRecord
                              ? 'bg-slate-900 text-slate-400 border border-slate-700'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {incident.isDemoRecord ? 'DEMO' : 'REAL'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-medium text-slate-200 truncate">
                      {incident.location.normalized}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>People: <strong className="text-white">{incident.people.affected ?? 'Unknown'}</strong></span>
                      <span className="capitalize text-cyan-300">{incident.status.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-slate-500">{incident.updatedAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Responder Command Detail Console */}
        <div className="lg:col-span-7 space-y-4">
          {activeIncident ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
              {/* Incident Header & Live Status Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-cyan-400">
                      {activeIncident.id}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {activeIncident.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Updated: {activeIncident.updatedAt} • Created: {activeIncident.createdAt}
                  </p>
                </div>

                {/* Status Changer Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono text-slate-400">STATUS:</span>
                  <select
                    value={activeIncident.status}
                    disabled={isUpdatingStatus}
                    onChange={(e) =>
                      handleStatusChange(activeIncident.id, e.target.value as IncidentStatus)
                    }
                    className="bg-slate-900 border border-cyan-700 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                  >
                    <option value="submitted">Submitted (Awaiting Review)</option>
                    <option value="reviewing">Reviewing (Triage Active)</option>
                    <option value="responding">Responding (Units Dispatched)</option>
                    <option value="rescue_in_progress">Rescue In Progress</option>
                    <option value="resolved">Resolved (Mission Complete)</option>
                    <option value="unverified">Unverified Rumor</option>
                  </select>
                </div>
              </div>

              {/* Responder Summary & Copy Button */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    AI Tactical Summary:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectIncidentOnMap(activeIncident)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline"
                    >
                      Locate on Map
                    </button>
                    <button
                      onClick={handleCopyBrief}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-850 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-700 font-mono transition"
                    >
                      {copiedBrief ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Brief</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {activeIncident.summary?.responderBrief ||
                    activeIncident.aiExplanations?.whyCritical ||
                    'Consolidated multi-signal incident telemetry.'}
                </p>
              </div>

              {/* Location & People Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Location */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location Details:
                  </span>
                  <div className="font-bold text-white text-xs">{activeIncident.location.normalized}</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activeIncident.location.landmarks.map((l, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-mono">
                        📍 {l}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-400 block pt-1 font-mono">
                    Perimeter: 500m Approximate Landmark Buffer
                  </span>
                </div>

                {/* People Count & Vulnerabilities */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> Demographic Intelligence:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-mono">
                      {activeIncident.people.affected ?? 'Unknown'}
                    </span>
                    <span className="text-slate-400 text-xs">persons trapped</span>
                  </div>
                  {activeIncident.people.vulnerable.length > 0 ? (
                    <div className="space-y-1 pt-1">
                      {activeIncident.people.vulnerable.map((v, i) => (
                        <span key={i} className="inline-block px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] mr-1">
                          ⚠ {v.type.toUpperCase()}: {v.details}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">No specific vulnerable persons flagged.</span>
                  )}
                </div>
              </div>

              {/* Situation-Specific Action Checklist */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <LifeBuoy className="w-4 h-4 text-cyan-400" />
                    Responder Mission Action Checklist:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Track field progress
                  </span>
                </div>

                <div className="space-y-2">
                  {(
                    activeIncident.summary?.actionChecklist || [
                      {
                        step: 1,
                        instruction: 'Establish physical cordon and command post near landmark.',
                        instructionTelugu: 'కమాండ్ పోస్ట్ ఏర్పాటు చేయండి.',
                        category: 'responder',
                        priority: 'immediate',
                      },
                      {
                        step: 2,
                        instruction: 'Deploy specialized extraction units (Boats / ALS Ambulance).',
                        instructionTelugu: 'రెస్క్యూ బోట్లు లేదా అంబులెన్స్ పంపండి.',
                        category: 'responder',
                        priority: 'immediate',
                      },
                    ]
                  ).map((item, idx) => {
                    const stepKey = `${activeIncident.id}-step-${item.step}`;
                    const isChecked = Boolean(completedChecklistSteps[stepKey]);

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistStep(stepKey)}
                        className={`p-2.5 rounded-lg border flex items-start gap-3 cursor-pointer transition ${
                          isChecked
                            ? 'bg-emerald-950/40 border-emerald-700 text-slate-300 line-through opacity-80'
                            : 'bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-slate-600 bg-slate-950'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="text-xs space-y-0.5 flex-1">
                          <p className="leading-snug">{item.instruction}</p>
                          <span className="text-[10px] uppercase font-mono text-slate-500">
                            Step {item.step} • {item.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Operational Log / Notes */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  Responder Operational Notes ({activeIncident.notes?.length || 0}):
                </span>

                {/* Notes Feed */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeIncident.notes && activeIncident.notes.length > 0 ? (
                    activeIncident.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <strong className="text-cyan-300">{note.author}</strong>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-slate-200">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No field notes added yet.</p>
                  )}
                </div>

                {/* Add Note Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={responderNoteText}
                    onChange={(e) => setResponderNoteText(e.target.value)}
                    placeholder="Add operational field update or responder note..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddNote();
                    }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={isSubmittingNote || !responderNoteText.trim()}
                    className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              Select an incident from the queue to view tactical responder briefing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
