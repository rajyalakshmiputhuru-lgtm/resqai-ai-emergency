'use client';

import React from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  MapPin,
  Languages,
  Clock,
  LifeBuoy,
  ShieldAlert,
  PlayCircle,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface JudgeModeViewProps {
  onStartLiveDemo: () => void;
  onLoadDemoData: () => void;
}

export default function JudgeModeView({
  onStartLiveDemo,
  onLoadDemoData,
}: JudgeModeViewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner: Manifesto */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-600/40 shadow-2xl relative overflow-hidden">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>JUDGE PRESENTATION & SYSTEM EVALUATION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
            WHY RESQAI?
          </h2>

          <blockquote className="text-lg sm:text-xl font-medium text-slate-200 italic border-l-4 border-amber-500 pl-4 py-1 leading-relaxed">
            &ldquo;Emergency responders don&apos;t suffer from a lack of information.
            They suffer from fragmented information.&rdquo;
          </blockquote>

          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            In mass urban crises (floods, industrial fires, multi-vehicle pileups), dispatch centers receive dozens of panicked calls, WhatsApp audio snippets, and citizen tweets.
            ResQAI uses <strong>ONE Google Gemini AI Model</strong> as a unified intelligence engine to collapse noisy, code-mixed, landmark-based chatter into a single, unambiguous operational picture.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onStartLiveDemo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold text-xs shadow-xl shadow-red-950 transition hover:scale-105"
            >
              <PlayCircle className="w-4 h-4" />
              RUN LIVE FLOOD DEMO (6 SIGNALS → 1 INCIDENT)
            </button>
            <button
              onClick={onLoadDemoData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              EVALUATE 52-REPORT BENCHMARK DATASET
            </button>
          </div>
        </div>
      </div>

      {/* Feature 1: The Single-AI Architecture Decision */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              1. The Architecture Decision: ONE GEMINI AI BRAIN
            </h3>
            <span className="text-xs text-slate-400">
              Why not multi-agent chains or multiple LLMs?
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
            <div className="font-bold text-rose-400 uppercase tracking-wide">
              ✕ Multi-Agent Pitfalls in Emergency Response:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>High latency from serial LLM-to-LLM roundtrips</li>
              <li>Error compounding and persona drift</li>
              <li>Expensive token cascades during traffic spikes</li>
              <li>Unpredictable handoff failures in crisis moments</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-2">
            <div className="font-bold text-cyan-400 uppercase tracking-wide">
              ✓ ResQAI Single-Gemini Solution:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>One unified schema-validated JSON inference call</li>
              <li>Atomic clustering, landmark resolution, and conflict analysis</li>
              <li>Instant deterministic fallback when offline (Zero secondary LLMs)</li>
              <li>Sub-second decision speed for tactical responders</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Feature 2: Indian Landmark Intelligence */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              2. Indian Landmark Intelligence (Top Feature)
            </h3>
            <span className="text-xs text-slate-400">
              Understanding natural, landmark-based Indian address descriptions
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Indians rarely report lat/long coordinates. They say:
          <em className="text-cyan-300 font-serif"> &ldquo;Near the Velachery MRTS west gate, behind the station Vijayanagar side opposite the medical shop.&rdquo;</em>
        </p>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="text-amber-400 font-bold">ResQAI Rule: Never invent exact GPS coordinates.</div>
          <div className="text-slate-300">
            ResQAI identifies urban landmark clusters, calculates spatial confidence (87%), flags{' '}
            <strong className="text-cyan-400">isApproximate: true</strong>, and renders an area perimeter buffer on the map to avoid dangerous false certainty.
          </div>
        </div>
      </div>

      {/* Feature 3: Telugu-English Multilingual Intelligence */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center">
            <Languages className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              3. Multilingual Telugu-English Code-Mixed Understanding
            </h3>
            <span className="text-xs text-slate-400">
              Zero manual translation step required
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <div className="font-serif italic text-slate-200">
            &ldquo;Velachery MRTS daggara water chala perigindi, 10 members trapped unnaru. Oka elderly person inside lo unnaru.&rdquo;
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div>Type: <strong className="text-cyan-400">FLOOD</strong></div>
            <div>Location: <strong className="text-cyan-400">Velachery MRTS</strong></div>
            <div>Count: <strong className="text-cyan-400">10 Trapped</strong></div>
            <div>Vulnerable: <strong className="text-rose-400">Elderly Citizen</strong></div>
          </div>
        </div>
      </div>

      {/* Feature 4: Incident Memory, Sequential Updates & Conflict Handling */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center">
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              4. Incident Memory & Conflict-Preserving Timeline
            </h3>
            <span className="text-xs text-slate-400">
              Never erasing old information when numbers fluctuate
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
            <span>08:10 (6 people)</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold">08:25 (10 people)</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-emerald-400 font-bold">09:30 (10 rescued safely)</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            When incoming reports revise casualty counts or trapped numbers, ResQAI highlights{' '}
            <strong className="text-amber-400">&ldquo;Conflicting information detected&rdquo;</strong>, keeps previous numbers in the immutable timeline history, and displays the latest verified state with source provenance.
          </p>
        </div>
      </div>

      {/* Feature 5: Explainable AI & Advisory Resource Dispatch */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center">
            <LifeBuoy className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              5. Advisory Dispatch: Human-in-the-Loop Protocol
            </h3>
            <span className="text-xs text-slate-400">
              Responsible, explainable AI for life-critical safety
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          ResQAI explicitly does <strong>NOT</strong> autonomously dispatch emergency teams.
          Every resource recommendation (Rescue boat, Medical team, Ambulance) is accompanied by the mandatory badge:{' '}
          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px]">
            AI Recommendation — Human approval required
          </span>
          {' '}and full explainable evidence breakdown (Why Critical? Why Same Incident?).
        </p>
      </div>
    </div>
  );
}
