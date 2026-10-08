'use client';

import React from 'react';
import {
  PlayCircle,
  Radio,
  Cpu,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface HeroBannerProps {
  onStartLiveDemo: () => void;
  onOpenDashboard: () => void;
  onTryAiAnalysis: () => void;
}

export default function HeroBanner({
  onStartLiveDemo,
  onOpenDashboard,
  onTryAiAnalysis,
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-[#0b101d] to-[#0d1628] p-6 sm:p-8 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        {/* Architecture Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono tracking-wide shadow">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>STRICT SINGLE-MODEL AI: GOOGLE GEMINI API</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
          ResQ<span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-lg sm:text-2xl font-bold text-slate-200 tracking-tight">
          &ldquo;From scattered signals to one clear emergency.&rdquo;
        </p>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Emergency responders don&apos;t suffer from a lack of information. They suffer from fragmented information.
          ResQAI orchestrates audio calls, WhatsApp alerts, SMS, and citizen reports into a single, real-time evolving incident picture.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartLiveDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-950/60 border border-red-400/40 transition hover:scale-105 active:scale-95"
          >
            <PlayCircle className="w-5 h-5 text-white animate-pulse" />
            START LIVE DEMO
          </button>
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition hover:scale-105 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            OPEN RESPONDER DASHBOARD
          </button>
          <button
            onClick={onTryAiAnalysis}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 font-semibold text-sm border border-cyan-800/80 transition hover:scale-105 active:scale-95"
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            TRY AI ANALYSIS
          </button>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ONE AI BRAIN → MANY EMERGENCY SIGNALS → ONE CLEAR INCIDENT PICTURE</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-left font-mono">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>INGEST</span>
                <span className="text-emerald-400">✓</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Audio Calls, WhatsApp, SMS, Social Media, Field Radios
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/60 flex flex-col justify-between shadow-sm shadow-cyan-950">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>UNDERSTAND</span>
                <span className="text-emerald-400">✓</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                ONE Gemini AI: Telugu, English, Hindi, Noise & Rumor filtering
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>EXTRACT</span>
                <span className="text-emerald-400">✓</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Indian Landmarks, Trapped Counts, Vulnerable Citizens, Urgency
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>TRACK & CLUSTER</span>
                <span className="text-emerald-400">✓</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Sequential Memory, Conflict Handling, Resolution Detection
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-900/60 flex flex-col justify-between col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>SHOW STATE</span>
                <span className="text-emerald-400">✓</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Interactive Map, Explainable AI Evidence, Resource Advisory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
