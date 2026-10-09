'use client';

import React from 'react';
import {
  ShieldAlert,
  Cpu,
  PlayCircle,
  Database,
  RotateCcw,
  Sparkles,
  LayoutDashboard,
  Radio,
  BarChart3,
  Award,
  Send,
  Shield,
  PhoneCall,
  BookOpen,
  Download,
  Activity,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'report'
  | 'responder'
  | 'resources'
  | 'ingestion'
  | 'analytics'
  | 'about'
  | 'judge';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onStartLiveDemo: () => void;
  onLoadDemoData: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onStartLiveDemo,
  onLoadDemoData,
  onReset,
  isLoading,
}: NavbarProps) {
  function handleDownloadCsv() {
    window.open('/api/export', '_blank');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30 border border-red-400/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-mono">
                  ResQ<span className="text-cyan-400">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  ONE GEMINI AI BRAIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                &ldquo;From scattered signals to one clear emergency.&rdquo;
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Export CSV */}
            <button
              onClick={handleDownloadCsv}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition"
              title="Download Incident Database as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>CSV</span>
            </button>

            {/* Start Live Demo */}
            <button
              onClick={onStartLiveDemo}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs transition shadow-lg shadow-red-950/50 border border-red-400/40 disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4 text-white animate-pulse" />
              <span className="hidden xs:inline">START LIVE DEMO</span>
              <span className="xs:hidden">DEMO</span>
            </button>

            {/* Load Demo Data */}
            <button
              onClick={onLoadDemoData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs transition border border-slate-700 disabled:opacity-50"
              title="Load 52-report benchmark across 5 incidents with Telugu & noise"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">LOAD DEMO DATA (52)</span>
              <span className="md:hidden">DATA</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition border border-slate-800"
              title="Reset All Incidents and Reports"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Judge Mode Switch */}
            <button
              onClick={() => setActiveTab('judge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                activeTab === 'judge'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-900/80 text-amber-400/90 hover:text-amber-300 border-amber-500/30 hover:bg-amber-500/10'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>JUDGE MODE</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 border-t border-slate-800/60 no-scrollbar">
          {/* Tab 1: Operations Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Live Dashboard
          </button>

          {/* Tab 2: Report Incident (Citizen / AI Triage) */}
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-red-950/70 text-red-300 border border-red-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-red-400" />
            Report / AI Triage
          </button>

          {/* Tab 3: Tactical Responder Command */}
          <button
            onClick={() => setActiveTab('responder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'responder'
                ? 'bg-blue-950/70 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Responder Command
          </button>

          {/* Tab 4: Emergency Resource Directory */}
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            Emergency Contacts
          </button>

          {/* Tab 5: Live Ingestion Console */}
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'ingestion'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Ingestion Console
          </button>

          {/* Tab 6: Analytics & Triage Metrics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics & Metrics
          </button>

          {/* Tab 7: About & Architecture */}
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            About & Architecture
          </button>

          {/* Tab 8: Judge Walkthrough */}
          <button
            onClick={() => setActiveTab('judge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'judge'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Judge Walkthrough
          </button>
        </div>
      </div>
    </header>
  );
}
