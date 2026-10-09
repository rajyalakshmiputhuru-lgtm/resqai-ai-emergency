'use client';

import React, { useState, useEffect } from 'react';
import { LIVE_DEMO_SEQUENCE } from '@/lib/data/dataset';
import { Incident } from '@/types';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Radio,
  Sparkles,
  Layers,
  Flame,
  Shield,
  LifeBuoy,
  X,
  FastForward,
} from 'lucide-react';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStepProcessed: () => void;
}

export default function LiveDemoModal({
  isOpen,
  onClose,
  onStepProcessed,
}: LiveDemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [logs, setLogs] = useState<Array<{ step: number; text: string; update: string }>>([]);

  const executeStep = React.useCallback(
    async (stepIndex: number) => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        const res = await fetch('/api/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'step', stepIndex }),
        });
        const data = await res.json();
        if (data.success) {
          setCurrentStep(stepIndex);
          const seqItem = LIVE_DEMO_SEQUENCE[stepIndex - 1];
          setLogs((prev) => [
            ...prev,
            {
              step: stepIndex,
              text: `[${seqItem.time} - ${seqItem.source.toUpperCase()}] ${seqItem.message}`,
              update: seqItem.expectedUpdate,
            },
          ]);
          onStepProcessed();
        }
      } catch (err) {
        console.error('Demo step failed:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, onStepProcessed]
  );

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && currentStep < LIVE_DEMO_SEQUENCE.length && !isProcessing) {
      timer = setTimeout(() => {
        executeStep(currentStep + 1);
      }, 2400);
    } else if (currentStep >= LIVE_DEMO_SEQUENCE.length) {
      setAutoPlay(false);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, currentStep, isProcessing, executeStep]);

  if (!isOpen) return null;

  async function handleReset() {
    setIsProcessing(true);
    setAutoPlay(false);
    try {
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      setCurrentStep(0);
      setLogs([]);
      onStepProcessed();
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }

  const activeSeq = currentStep > 0 ? LIVE_DEMO_SEQUENCE[currentStep - 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                  LIVE DEMO SIMULATION
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  VELACHERY FLOOD EVOLUTION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Witness 6 raw signals collapse into 1 continuously evolving incident record.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Visual Diagram */}
        <div className="p-4 bg-slate-900/30 border-b border-slate-800/80">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI PIPELINE EXECUTION</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
            {[
              { label: 'RAW SIGNAL', desc: 'Telugu/English Audio' },
              { label: 'ONE GEMINI AI', desc: 'Language & Noise' },
              { label: 'EXTRACT', desc: 'Landmarks & People' },
              { label: 'MATCH', desc: '94% Cluster Score' },
              { label: 'UPDATE', desc: 'Incident Memory' },
              { label: 'RESPONDER', desc: 'Triage Dashboard' },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border text-left flex flex-col justify-between ${
                  currentStep > 0
                    ? 'bg-slate-900 border-cyan-700/60 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-bold text-[11px] text-cyan-300">{step.label}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">{step.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {LIVE_DEMO_SEQUENCE.map((item) => {
              const isPast = item.step <= currentStep;
              const isCurrent = item.step === currentStep;

              return (
                <button
                  key={item.step}
                  onClick={() => executeStep(item.step)}
                  disabled={isProcessing}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-red-950/70 border-red-500 shadow-lg shadow-red-950/40 text-white'
                      : isPast
                      ? 'bg-slate-900 border-emerald-600/60 text-slate-200'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span>STEP {item.step}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="mt-1 font-bold text-xs">{item.time}</div>
                  <span className="text-[10px] text-slate-400 truncate uppercase mt-0.5">
                    {item.source.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Details */}
          {activeSeq && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    CURRENT SIGNAL #{currentStep} OF 6
                  </span>
                  <span className="text-xs text-slate-400">
                    Source: <strong className="text-white">{activeSeq.sender}</strong>
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400">
                  Lang: {activeSeq.language}
                </span>
              </div>

              {/* Message text */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-serif italic text-sm text-slate-100">
                &ldquo;{activeSeq.message}&rdquo;
              </div>

              {/* What Gemini Executed */}
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ONE GEMINI AI REASONING & MEMORY UPDATE:</span>
                </div>
                <p className="font-mono text-white text-[11px]">{activeSeq.expectedUpdate}</p>
              </div>
            </div>
          )}

          {/* Execution History Log */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Sequential Incident Memory Timeline:
            </h4>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-xs text-slate-600 italic">
                  Press &quot;Advance Step&quot; or &quot;Auto Play&quot; to begin simulation.
                </p>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-300 font-mono text-[11px] truncate flex-1">
                      {log.text}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono shrink-0">
                      {log.update}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => executeStep(currentStep + 1)}
              disabled={isProcessing || currentStep >= LIVE_DEMO_SEQUENCE.length}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-lg shadow-red-950/50 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              {currentStep === 0
                ? 'START STEP 1 (08:10)'
                : currentStep < LIVE_DEMO_SEQUENCE.length
                ? `ADVANCE TO STEP ${currentStep + 1}`
                : 'SIMULATION COMPLETE'}
            </button>

            <button
              onClick={() => setAutoPlay(!autoPlay)}
              disabled={isProcessing || currentStep >= LIVE_DEMO_SEQUENCE.length}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                autoPlay
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
              }`}
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{autoPlay ? 'PAUSE AUTO' : 'AUTO PLAY'}</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Reset Live Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 text-xs font-semibold transition"
          >
            Return to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
