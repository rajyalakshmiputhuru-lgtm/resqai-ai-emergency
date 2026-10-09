'use client';

import React from 'react';
import {
  Cpu,
  Layers,
  MapPin,
  Languages,
  Shield,
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Workflow,
  Sparkles,
  ArrowRight,
  Database,
  PhoneCall,
  Activity,
} from 'lucide-react';

export default function AboutArchitectureView() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0d162d] to-slate-950 border border-cyan-800/60 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>RESQAI ARCHITECTURAL BLUEPRINT</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
          System Architecture & Operational Philosophy
        </h2>

        <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-3xl">
          ResQAI is designed to solve a foundational crisis challenge: in disasters, emergency dispatchers receive fragmented, noisy, code-mixed signals from multiple channels that overwhelm human operators.
        </p>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-cyan-300">
          Tagline: &ldquo;From scattered signals to one clear emergency.&rdquo;
        </div>
      </div>

      {/* 1. Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-rose-950/80 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-sm uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>The Crisis Problem</span>
          </div>
          <h3 className="text-lg font-bold text-white">Signal Fragmentation & Cognitive Overload</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Duplicate Over-Reporting:</strong> 15 panicked citizens report the same flooded apartment complex under slightly different names.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Code-Mixed Indian Languages:</strong> Audio calls and WhatsApp texts mix Telugu, Tamil, and English (e.g. &ldquo;MRTS daggara water chala perigindi&rdquo;).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Landmark Ambiguity:</strong> Callers cite landmark relative directions (&ldquo;opposite medical shop near station backside&rdquo;) rather than GPS coordinates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Conflicting Casualty Counts:</strong> One caller claims 6 people trapped; an update 15 minutes later cites 10; previous records get erased or confused.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-cyan-950/80 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm uppercase">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>The ResQAI Solution</span>
          </div>
          <h3 className="text-lg font-bold text-white">Consolidated Single Operational Picture</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Atomic Multilingual Ingestion:</strong> Ingests English, Telugu, and Hindi audio transcripts and text messages without external translation lag.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Indian Landmark Normalization:</strong> Resolves approximate landmark clusters and flags <em>isApproximate: true</em> to prevent false GPS precision.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Cluster Matching:</strong> Uses spatial and semantic similarity factors (94%) to collapse duplicate signals into a single evolving incident ticket.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Immutable What-Changed Memory:</strong> Preserves previous casualty counts in chronological logs while highlighting active conflicts for human verification.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 2. The Strict Single-AI Architecture Decision */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-mono text-base font-bold">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Core Decision: Strict Single-Model AI (Google Gemini API)</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ResQAI explicitly adheres to a <strong>single AI model architecture</strong> powered exclusively by the <strong>Google Gemini API</strong>.
          We do not deploy multi-agent LLM chains, router networks, or secondary AI providers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <strong className="text-rose-400 block font-mono">WHY WE REJECT MULTI-AGENT ARCHITECTURES:</strong>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
              <li><strong>Latency Multipliers:</strong> 3-agent or 5-agent sequential roundtrips take 6-12 seconds—unacceptable when seconds mean lives in flash floods or fires.</li>
              <li><strong>Context Drift & Compounding Errors:</strong> Agent A misclassifies a street; Agent B builds a tactical plan on the hallucination; Agent C compounds the error.</li>
              <li><strong>Fragile Network Cascades:</strong> Any single LLM timeout in the chain breaks the entire emergency ingestion flow.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-800/60 space-y-2">
            <strong className="text-cyan-300 block font-mono">WHY ONE GEMINI MODEL SUCCEEDS:</strong>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
              <li><strong>Sub-Second Execution:</strong> Gemini 1.5 Flash provides sub-second schema-validated JSON outputs in a single atomic inference call.</li>
              <li><strong>Native Code-Mixing:</strong> Gemini natively comprehends Telugu-English and Indian urban colloquialisms without preprocessing translation pipelines.</li>
              <li><strong>Unified Schema Reasoning:</strong> Simultaneously performs classification, landmark extraction, duplicate clustering, and conflict detection.</li>
              <li><strong>Deterministic Fallback:</strong> If offline or API key is absent, an offline deterministic engine takes over seamlessly with zero secondary LLM reliance.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. The End-to-End Workflow */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-mono text-base font-bold">
          <Workflow className="w-5 h-5 text-cyan-400" />
          <span>End-to-End Processing Pipeline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">1. INGEST</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Raw audio calls, WhatsApp alerts, SMS, social media, and citizen forms enter the ingestion bus.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">2. UNDERSTAND</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Gemini filters non-emergency noise, tags unverified rumors, and parses Telugu/English code-mixing.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">3. EXTRACT</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Identifies Indian urban landmarks, trapped people counts, and vulnerable individuals.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">4. CLUSTER</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Compares against active incidents, identifies duplicate clusters, and logs conflicting counts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-800/80 space-y-1">
            <span className="text-emerald-400 font-bold block">5. COMMAND</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Synthesizes interactive maps, action checklists, and advisory resource recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Limitations & Human-in-the-Loop Policy */}
      <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-800/60 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-mono text-base font-bold">
          <LifeBuoy className="w-5 h-5 text-amber-400" />
          <span>Operational Limitations & Ethical Safety Boundaries</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          Responsible emergency AI systems must acknowledge their boundaries. ResQAI enforces three ironclad rules:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-900/60 space-y-1">
            <strong className="text-amber-400 block font-mono">1. NO AUTONOMOUS DISPATCH:</strong>
            <p className="text-slate-400 text-[11px]">
              ResQAI does NOT independently command rescue units, send police, or route fire engines. All resource tags are explicitly marked &ldquo;AI Recommendation — Human approval required&rdquo;.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-900/60 space-y-1">
            <strong className="text-amber-400 block font-mono">2. NO FABRICATED GPS:</strong>
            <p className="text-slate-400 text-[11px]">
              When callers cite descriptive landmarks without coordinates, the AI never invents a pinpoint street address. It pins the landmark centroid and tags <em>isApproximate: true</em>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-900/60 space-y-1">
            <strong className="text-amber-400 block font-mono">3. IMMUTABLE TIMELINE LOGS:</strong>
            <p className="text-slate-400 text-[11px]">
              When numbers fluctuate (e.g. 6 to 10), ResQAI does not overwrite history. Both figures remain permanently auditable in the chronological What-Changed ledger.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Privacy & Security */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-white font-mono text-base font-bold">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>Privacy & Security Guarantees</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-emerald-400 block font-mono">SERVER-SIDE API KEYS ONLY:</strong>
            <p className="text-slate-400 text-[11px]">
              The Google Gemini API key is strictly maintained in server-side environment variables. No client bundle or browser JavaScript ever receives or exposes credentials.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-emerald-400 block font-mono">DATA SANITIZATION:</strong>
            <p className="text-slate-400 text-[11px]">
              Citizen telephone numbers are masked in public telemetry streams. Input payloads undergo strict schema validation to prevent injection attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
