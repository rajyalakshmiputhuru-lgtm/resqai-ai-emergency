'use client';

import React, { useState } from 'react';
import {
  SignalSource,
  EmergencySignal,
  AnalysisResult,
  PipelineStep,
} from '@/types';
import {
  Radio,
  Send,
  Sparkles,
  Cpu,
  Mic,
  MessageSquare,
  MessageCircle,
  Twitter,
  Shield,
  Layers,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Loader2,
  Flame,
  Volume2,
} from 'lucide-react';

interface LiveIngestionConsoleProps {
  onSignalIngested: () => void;
}

export default function LiveIngestionConsole({
  onSignalIngested,
}: LiveIngestionConsoleProps) {
  const [source, setSource] = useState<SignalSource>('whatsapp');
  const [language, setLanguage] = useState('Telugu-English');
  const [sender, setSender] = useState('+91-98401XXXXX (Resident)');
  const [message, setMessage] = useState(
    'Velachery MRTS daggara water chala perigindi, 10 members trapped unnaru. Oka elderly person inside lo unnaru.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    { step: 'ingest', label: 'INGEST', status: 'pending' },
    { step: 'understand', label: 'UNDERSTAND', status: 'pending' },
    { step: 'extract', label: 'EXTRACT', status: 'pending' },
    { step: 'track', label: 'TRACK & CLUSTER', status: 'pending' },
    { step: 'show', label: 'SHOW STATE', status: 'pending' },
  ]);
  const [showJson, setShowJson] = useState(false);

  // Preset quick samples for judges
  const PRESET_SAMPLES = [
    {
      label: 'Telugu Flood (10 Trapped + Elderly)',
      source: 'whatsapp' as SignalSource,
      language: 'Telugu-English',
      sender: 'WhatsApp Group (Velachery)',
      text: 'Velachery MRTS daggara water chala perigindi, 10 members trapped unnaru. Oka elderly person inside lo unnaru.',
    },
    {
      label: 'Noise Traffic Tweet',
      source: 'social_media' as SignalSource,
      language: 'English',
      sender: '@chennai_commute',
      text: 'Traffic is heavy near Velachery bypass road today. Anyone know why Swiggy delivery is delayed?',
    },
    {
      label: 'Unverified Rumor',
      source: 'social_media' as SignalSource,
      language: 'English',
      sender: '@anonymous_whisper',
      text: 'Someone said maybe 20 people are trapped somewhere in south chennai, unverified forwarded message.',
    },
    {
      label: 'Ambattur Fire in Telugu',
      source: 'audio_call' as SignalSource,
      language: 'Telugu-English',
      sender: '101 Emergency Fire Call',
      text: 'Ambattur estate lo pedda manta vacchindi, 4 workers inside trapped unnaru! Fire engine urgent!',
    },
    {
      label: 'Resolution Confirmation',
      source: 'field_responder' as SignalSource,
      language: 'English',
      sender: 'NDRF Rescue Unit 4',
      text: 'All 10 residents including the elderly person evacuated safely. Everyone rescued.',
    },
  ];

  async function handleAnalyze() {
    if (!message.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Animate pipeline stages
    setPipelineSteps([
      { step: 'ingest', label: 'INGEST', status: 'processing', details: 'Ingesting raw signal payload' },
      { step: 'understand', label: 'UNDERSTAND', status: 'pending' },
      { step: 'extract', label: 'EXTRACT', status: 'pending' },
      { step: 'track', label: 'TRACK & CLUSTER', status: 'pending' },
      { step: 'show', label: 'SHOW STATE', status: 'pending' },
    ]);

    await new Promise((r) => setTimeout(r, 250));

    setPipelineSteps((prev) =>
      prev.map((s, idx) =>
        idx === 0
          ? { ...s, status: 'completed' }
          : idx === 1
          ? { ...s, status: 'processing', details: 'Gemini multilingual & noise check' }
          : s
      )
    );

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signal: {
            id: `LIVE-${Date.now()}`,
            source,
            sender,
            rawText: message,
            language,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isDemoConnector: true,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPipelineSteps([
          { step: 'ingest', label: 'INGEST', status: 'completed' },
          { step: 'understand', label: 'UNDERSTAND', status: 'completed' },
          { step: 'extract', label: 'EXTRACT', status: 'completed' },
          { step: 'track', label: 'TRACK & CLUSTER', status: 'completed' },
          { step: 'show', label: 'SHOW STATE', status: 'completed' },
        ]);
        setAnalysisResult(data.analysis);
        onSignalIngested();
      }
    } catch (err) {
      console.error('Ingestion failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function getConnectorBadge(src: SignalSource) {
    switch (src) {
      case 'whatsapp':
        return <span className="flex items-center gap-1 text-emerald-400"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp Connector</span>;
      case 'audio_call':
        return <span className="flex items-center gap-1 text-blue-400"><Mic className="w-3.5 h-3.5" /> Audio Call Connector</span>;
      case 'sms':
        return <span className="flex items-center gap-1 text-cyan-400"><MessageCircle className="w-3.5 h-3.5" /> SMS Gateway Connector</span>;
      case 'social_media':
        return <span className="flex items-center gap-1 text-sky-400"><Twitter className="w-3.5 h-3.5" /> Social Media Connector</span>;
      case 'field_responder':
        return <span className="flex items-center gap-1 text-amber-400"><Shield className="w-3.5 h-3.5" /> Field Radio Connector</span>;
      default:
        return <span>Manual Ingestion</span>;
    }
  }

  return (
    <div className="space-y-6">
      {/* Connector Header Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <strong className="text-white">DEMO CONNECTORS ACTIVATED:</strong>
          <span>Simulated ingest pipeline for multi-channel emergency streams.</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px]">
          READY FOR LIVE ENTERPRISE WEBSOCKETS / WEBHOOKS
        </span>
      </div>

      {/* Main Form & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
              <span>LIVE INGESTION CONSOLE</span>
              <span className="text-[10px] text-cyan-400 font-normal">ONE GEMINI AI PIPELINE</span>
            </h3>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Quick Test Scenarios (Judge Presets):</label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSource(sample.source);
                      setLanguage(sample.language);
                      setSender(sample.sender);
                      setMessage(sample.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Source & Language Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Channel Source:</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as SignalSource)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="whatsapp">WhatsApp (DEMO)</option>
                  <option value="audio_call">Emergency Call (DEMO)</option>
                  <option value="sms">SMS Gateway (DEMO)</option>
                  <option value="social_media">Social Media X (DEMO)</option>
                  <option value="field_responder">Field Radio (DEMO)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Signal Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Telugu-English">Telugu-English (Code-Mixed)</option>
                  <option value="English">English</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Sender Identifier:</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400">Emergency Message Text / Transcript:</label>
                <div className="text-[11px] text-cyan-400 font-mono">
                  {getConnectorBadge(source)}
                </div>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter raw signal message, audio call transcript, or citizen alert..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            {/* Analyze Action */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !message.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/60 border border-cyan-400/40 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>ANALYZING WITH GEMINI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>ANALYZE WITH GEMINI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Pipeline & Results */}
        <div className="lg:col-span-5 space-y-4">
          {/* Visual Step Progress */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 block tracking-wider">
              REAL-TIME PIPELINE PROGRESSION:
            </span>

            <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
              {pipelineSteps.map((s, idx) => (
                <div
                  key={s.step}
                  className={`flex-1 p-2 rounded-lg border text-center transition ${
                    s.status === 'completed'
                      ? 'bg-slate-900 border-emerald-600 text-emerald-400'
                      : s.status === 'processing'
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <span>{s.label}</span>
                    {s.status === 'completed' && <span>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Intelligence Cards */}
          {analysisResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-800/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    GEMINI EXTRACTION RESULT
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      analysisResult.classification === 'emergency'
                        ? 'bg-red-950 text-red-400 border border-red-700'
                        : analysisResult.classification === 'non-emergency'
                        ? 'bg-slate-900 text-slate-400 border border-slate-700'
                        : 'bg-amber-950 text-amber-400 border border-amber-700'
                    }`}
                  >
                    {analysisResult.classification}
                  </span>
                </div>

                <button
                  onClick={() => setShowJson(!showJson)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showJson ? 'Hide JSON' : 'View Schema JSON'}</span>
                </button>
              </div>

              {/* JSON Toggle */}
              {showJson ? (
                <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 font-mono overflow-x-auto max-h-[300px]">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              ) : (
                <div className="space-y-3 text-xs">
                  {/* Location & Landmark */}
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      Normalized Location:
                    </span>
                    <p className="text-white font-medium">
                      {analysisResult.location.normalized}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
                        📍 APPROXIMATE LOCATION ({Math.round(analysisResult.location.confidence * 100)}%)
                      </span>
                      {analysisResult.location.landmarks.map((l, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* People & Urgency */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400">People Affected:</span>
                      <div className="font-mono font-bold text-white text-base">
                        {analysisResult.people.affected ?? 'None'}
                      </div>
                      {analysisResult.people.vulnerable.length > 0 && (
                        <span className="text-[10px] text-rose-400 font-semibold block">
                          ⚠ {analysisResult.people.vulnerable[0].type}
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400">Urgency Assessment:</span>
                      <div className="font-bold text-base uppercase text-red-400">
                        {analysisResult.urgency}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Severity: {analysisResult.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Clustering & Match Verdict */}
                  <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-900/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-300 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        Clustering Decision:
                      </span>
                      <span className="font-mono text-purple-300 font-bold">
                        {analysisResult.match.similarityScore}% Match
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      {analysisResult.match.reason}
                    </p>
                  </div>

                  {/* Recommended Resources (Advisory) */}
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Recommended Units:</span>
                      <span className="text-[10px] text-amber-400">Human Approval Required</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.resources.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] uppercase font-mono"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
