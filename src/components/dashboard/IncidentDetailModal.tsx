'use client';

import React, { useState } from 'react';
import { Incident, IncidentStatus } from '@/types';
import {
  X,
  MapPin,
  Users,
  Flame,
  LifeBuoy,
  Clock,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertOctagon,
  ArrowRight,
  Copy,
  Check,
  Phone,
  Languages,
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export default function IncidentDetailModal({
  incident,
  onClose,
  onStatusUpdated,
}: IncidentDetailModalProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLoc, setCopiedLoc] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'English' | 'Telugu'>('English');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!incident) return null;

  const isCritical = incident.urgency === 'critical';
  const isResolved = incident.status === 'resolved';

  function handleCopySummary() {
    if (!incident) return;
    const summaryText =
      incident.summary?.responderBrief ||
      `${incident.id} ${incident.urgency.toUpperCase()} ${incident.incidentType.toUpperCase()} at ${incident.location.normalized}. ${incident.people.affected ?? 0} affected.`;
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  }

  function handleCopyLocation() {
    if (!incident) return;
    navigator.clipboard.writeText(incident.location.normalized);
    setCopiedLoc(true);
    setTimeout(() => setCopiedLoc(false), 2000);
  }

  async function handleStatusChange(newStatus: IncidentStatus) {
    if (!incident) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          incidentId: incident.id,
          status: newStatus,
          responderNotes: `Status changed to ${newStatus.replace(/_/g, ' ').toUpperCase()} from Incident Detail Modal`,
        }),
      });
      const data = await res.json();
      if (data.success && onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-slate-800 text-white border border-slate-700">
              {incident.id}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {incident.title}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    isCritical
                      ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                      : isResolved
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                      : 'bg-amber-950 text-amber-400 border border-amber-700'
                  }`}
                >
                  {incident.urgency}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    incident.isDemoRecord
                      ? 'bg-slate-900 text-slate-400 border border-slate-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {incident.isDemoRecord ? 'DEMO SIMULATION' : 'REAL INCIDENT'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Created: {incident.createdAt} • Latest Ingestion: {incident.updatedAt} • AI Confidence: {Math.round(incident.confidence * 100)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
              title="Copy incident briefing"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Copy Brief'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          {/* Status Lifecycle Controls & Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-slate-400">OPERATIONAL STATUS:</span>
              <select
                value={incident.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as IncidentStatus)}
                className="bg-slate-950 border border-cyan-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-bold focus:outline-none disabled:opacity-50"
              >
                <option value="submitted">Submitted (Awaiting Review)</option>
                <option value="reviewing">Reviewing (Triage Active)</option>
                <option value="responding">Responding (Units Dispatched)</option>
                <option value="rescue_in_progress">Rescue In Progress</option>
                <option value="resolved">Resolved (Mission Complete)</option>
                <option value="unverified">Unverified Rumor</option>
              </select>
            </div>

            <span className="text-[11px] text-amber-300/80 font-mono">
              Advisory Dispatch Only (Human in the loop)
            </span>
          </div>

          {/* Section 1: CURRENT SITUATION */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                1. Situation Summary & Responder Brief
              </h3>
              <button
                onClick={handleCopySummary}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSummary ? 'Copied Brief' : 'Copy Brief'}</span>
              </button>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {incident.summary?.responderBrief ||
                `Active ${incident.incidentType} event in ${incident.location.normalized}. ResQAI has ingested and consolidated ${incident.signals.length} distinct reports into this single operational picture. Currently ${incident.people.affected ?? 'unspecified'} people affected with urgency assessed as ${incident.urgency.toUpperCase()}.`}
            </p>
          </div>

          {/* Section 2: LOCATION INTELLIGENCE */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                2. Indian Landmark Intelligence
              </h3>
              <button
                onClick={handleCopyLocation}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                {copiedLoc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLoc ? 'Copied Location' : 'Copy Location'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400">Normalized Area:</span>
                <div className="font-semibold text-white">{incident.location.normalized}</div>
                <div className="text-slate-400 mt-2">Relative Position & Clues:</div>
                <div className="text-slate-300">
                  {incident.location.relativePosition || 'Near landmark centroid'}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Identified Landmarks:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {incident.location.landmarks.map((l, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-[11px]"
                    >
                      📍 {l}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <span className="px-2 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800 text-[11px] font-mono inline-block">
                    APPROXIMATE LOCATION ({Math.round(incident.location.confidence * 100)}% Confidence)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    Coordinates synthesized from landmarks. Never fabricating exact street address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: ACTION CHECKLIST & SAFETY INSTRUCTIONS */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 text-cyan-400" />
                3. Action Checklist & Situation-Specific Safety Steps
              </h3>

              <div className="flex items-center gap-1 text-[11px] bg-slate-900 p-1 rounded border border-slate-700">
                <button
                  onClick={() => setSelectedLang('English')}
                  className={`px-2 py-0.5 rounded ${selectedLang === 'English' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setSelectedLang('Telugu')}
                  className={`px-2 py-0.5 rounded ${selectedLang === 'Telugu' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(
                incident.summary?.actionChecklist || [
                  {
                    step: 1,
                    instruction: 'Move immediately to higher ground or roof terrace. Avoid submerged structures.',
                    instructionTelugu: 'తక్షణమే ఎత్తైన ప్రదేశాలకు వెళ్ళండి. నీరు చేరిన ప్రదేశాలను నివారించండి.',
                    category: 'citizen',
                    priority: 'immediate',
                  },
                  {
                    step: 2,
                    instruction: 'Turn off electrical main switch and disconnect gas cylinders safely.',
                    instructionTelugu: 'విద్యుత్ మెయిన్ స్విచ్ మరియు గ్యాస్ సిలిండర్లను ఆపివేయండి.',
                    category: 'citizen',
                    priority: 'immediate',
                  },
                  {
                    step: 3,
                    instruction: 'Deploy specialized evacuation units with emergency lifejackets.',
                    instructionTelugu: 'లైఫ్ జాకెట్లతో రెస్క్యూ బోట్లను పంపించండి.',
                    category: 'responder',
                    priority: 'high',
                  },
                ]
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div className="space-y-0.5 flex-1">
                    <p className="text-slate-200 leading-snug">
                      {selectedLang === 'Telugu' && item.instructionTelugu
                        ? item.instructionTelugu
                        : item.instruction}
                    </p>
                    <span className="text-[10px] uppercase font-mono text-slate-500">
                      Priority: {item.priority} • For: {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 & 5: PEOPLE & VULNERABILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* People Affected */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                4. People Affected & Trapped
              </h3>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white font-mono">
                  {incident.people.affected ?? 'Unknown'}
                </span>
                <span className="text-slate-400 text-xs">
                  (Trapped count: {incident.people.trapped ?? 'Same'})
                </span>
              </div>
              {incident.peopleHistory.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">People Count History:</div>
                  <div className="flex items-center gap-2 font-mono">
                    {incident.peopleHistory.map((h, i) => (
                      <span key={i} className="flex items-center gap-1 text-slate-300">
                        {i > 0 && <ArrowRight className="w-3 h-3 text-cyan-400" />}
                        <strong className="text-white">{h.count}</strong> ({h.timestamp})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vulnerable People */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                5. Vulnerable Individuals Detected
              </h3>
              {incident.people.vulnerable.length === 0 ? (
                <p className="text-slate-500 text-xs italic">
                  No specific vulnerable individuals flagged in current reports.
                </p>
              ) : (
                <div className="space-y-2">
                  {incident.people.vulnerable.map((vuln, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs space-y-1"
                    >
                      <span className="font-bold uppercase text-rose-300 text-[11px]">
                        ⚠ {vuln.type}
                      </span>
                      <p className="text-slate-200">{vuln.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 6: RESOURCE NEED (ADVISORY HUMAN-IN-THE-LOOP) */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                6. Advisory Resource Recommendations
              </h3>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wide">
                AI Recommendation — Human approval required
              </span>
            </div>

            <p className="text-xs text-slate-400">
              The AI does NOT autonomously command rescue operations or independently dispatch emergency units.
              Responders must review and authorize:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {incident.resources.map((res, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-cyan-300 border border-cyan-700/60 font-semibold uppercase text-xs flex items-center gap-1.5 shadow"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  {res}
                </span>
              ))}
            </div>
          </div>

          {/* Section 7: WHAT CHANGED TIMELINE */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              7. What Changed Chronological Log
            </h3>
            <div className="space-y-2">
              {incident.whatChanged.map((wc, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start gap-3"
                >
                  <span className="font-mono text-slate-500 shrink-0 text-[11px]">
                    {wc.timestamp}
                  </span>
                  <div className="space-y-0.5 flex-1">
                    <span className="font-bold text-slate-200">{wc.label}</span>
                    {wc.from !== undefined && wc.to !== undefined && (
                      <span className="font-mono text-cyan-400 ml-2">
                        [{String(wc.from)} → {String(wc.to)}]
                      </span>
                    )}
                    <p className="text-slate-400 text-[11px]">{wc.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: SOURCE REPORTS */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              8. Clustered Source Reports ({incident.signals.length} reports)
            </h3>
            <div className="space-y-2">
              {incident.signals.map((sig, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">
                      [{sig.source.toUpperCase()}] {sig.sender}
                    </span>
                    <span className="text-slate-500 font-mono">{sig.timestamp}</span>
                  </div>
                  <p className="text-slate-300 italic font-serif">&ldquo;{sig.rawText}&rdquo;</p>
                  <span className="text-[10px] text-amber-300 font-mono">
                    Language: {sig.language}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9: AI EVIDENCE & UNCERTAINTIES */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              9. Explainable AI Evidence & Uncertainties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-2">
                <span className="font-semibold text-white">Why Critical & Clustered:</span>
                <p className="text-slate-300">
                  {incident.aiExplanations?.whyCritical || 'High risk situation with multiple lives in danger.'}
                </p>
                <p className="text-slate-400 text-[11px]">
                  {incident.aiExplanations?.whySameIncident || 'Contiguous location and matching emergency dynamics.'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-semibold text-amber-400">Communicated Uncertainties:</span>
                <ul className="list-disc pl-4 text-slate-300 space-y-1 text-[11px]">
                  {incident.uncertainties.length > 0 ? (
                    incident.uncertainties.map((u, i) => <li key={i}>{u}</li>)
                  ) : (
                    <li>Exact interior layout requires reconnaissance</li>
                  )}
                  <li>Human validation mandated before tactical dispatch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            ONE GEMINI AI BRAIN • STRICT STRUCTURED SCHEMA
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
          >
            Close Incident
          </button>
        </div>
      </div>
    </div>
  );
}
