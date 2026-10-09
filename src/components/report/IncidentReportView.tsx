'use client';

import React, { useState } from 'react';
import {
  IncidentType,
  UrgencyLevel,
  EmergencySignal,
  AnalysisResult,
  ActionChecklistItem,
} from '@/types';
import { KNOWN_LANDMARKS } from '@/lib/data/known-locations';
import {
  AlertTriangle,
  Send,
  MapPin,
  Sparkles,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  LifeBuoy,
  FileText,
  Phone,
  Flame,
  Waves,
  HeartPulse,
  Car,
  Building,
  AlertOctagon,
  Languages,
} from 'lucide-react';

interface IncidentReportViewProps {
  onReportSubmitted: () => void;
  onNavigateToDashboard: () => void;
}

export default function IncidentReportView({
  onReportSubmitted,
  onNavigateToDashboard,
}: IncidentReportViewProps) {
  const [language, setLanguage] = useState<'English' | 'Telugu'>('English');
  const [incidentType, setIncidentType] = useState<IncidentType>('flood');
  const [description, setDescription] = useState('');
  const [selectedLandmark, setSelectedLandmark] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [peopleCount, setPeopleCount] = useState<string>('');
  const [vulnerableCategories, setVulnerableCategories] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState('');
  const [isDemoSubmission, setIsDemoSubmission] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick preset samples
  const QUICK_REPORT_SAMPLES = [
    {
      title: language === 'English' ? 'Velachery Flood Entrapment' : 'వేళచ్చేరి వరదల్లో చిక్కుకున్న వారు',
      type: 'flood' as IncidentType,
      text:
        language === 'English'
          ? 'Water level is 4 feet high near Velachery MRTS west gate. 8 family members including an elderly grandmother are trapped on the ground floor.'
          : 'వేళచ్చేరి MRTS స్టేషన్ దగ్గర 4 అడుగుల నీరు చేరింది. ఇంట్లో ఒక బామ్మతో సహా 8 మంది చిక్కుకున్నారు. వెంటనే బోట్ పంపండి.',
      landmark: 'Velachery MRTS Station',
      people: '8',
      vuln: ['elderly'],
    },
    {
      title: language === 'English' ? 'Ambattur Industrial Fire' : 'అంబత్తూరు ఫ్యాక్టరీ అగ్నిప్రమాదం',
      type: 'fire' as IncidentType,
      text:
        language === 'English'
          ? 'Heavy black smoke and flames coming from chemical warehouse in Ambattur Industrial Estate Phase 2. 4 night shift workers trapped inside.'
          : 'అంబత్తూరు ఇండస్ట్రియల్ ఎస్టేట్ లో కెమికల్ గోడౌన్ లో భారీ మంటలు మరియు పొగ వ్యాపించింది. 4 మంది కార్మికులు లోపల ఉన్నారు.',
      landmark: 'Ambattur Industrial Estate',
      people: '4',
      vuln: [],
    },
    {
      title: language === 'English' ? 'OMR Collision with Casualties' : 'ఓఎంఆర్ రోడ్డు ప్రమాదం',
      type: 'accident' as IncidentType,
      text:
        language === 'English'
          ? 'Multi-car collision near OMR Sholinganallur Junction. Two passengers severely injured and bleeding, ambulance needed immediately.'
          : 'ఓఎంఆర్ షోళింగనల్లూర్ జంక్షన్ దగ్గర కార్ల ప్రమాదం. ఇద్దరికి తీవ్ర రక్తస్రావం జరుగుతోంది, అంబులెన్స్ వెంటనే కావాలి.',
      landmark: 'OMR Sholinganallur Junction',
      people: '2',
      vuln: ['injured'],
    },
  ];

  function toggleVulnerable(item: string) {
    setVulnerableCategories((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function handleSelectLandmark(name: string) {
    setSelectedLandmark(name);
    if (name) {
      const match = KNOWN_LANDMARKS.find((l) => l.name === name);
      if (match) {
        setCustomLocation(`${match.name}, ${match.area}, ${match.city}`);
      }
    }
  }

  function handleCopyLocation() {
    const locText = customLocation || selectedLandmark || 'Approximate Landmark Centroid';
    navigator.clipboard.writeText(locText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }

  async function handleAnalyzeAndSubmit() {
    if (!description.trim()) {
      setErrorMsg(
        language === 'English'
          ? 'Please enter an incident description.'
          : 'దయచేసి సంఘటన వివరాలను నమోదు చేయండి.'
      );
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setSubmittedIncidentId(null);

    // Build raw text combining description, location, and vulnerable details
    const locationString = customLocation || selectedLandmark || 'Urban Area';
    const vulnString =
      vulnerableCategories.length > 0
        ? ` Vulnerable individuals noted: ${vulnerableCategories.join(', ')}.`
        : '';
    const peopleString = peopleCount ? ` Approximately ${peopleCount} people affected.` : '';

    const synthesizedRawText = `${description} Location: ${locationString}.${peopleString}${vulnString}`;

    try {
      const signalPayload: EmergencySignal = {
        id: `CITIZEN-${Date.now()}`,
        source: 'manual',
        sender: contactInfo ? `Citizen (${contactInfo})` : 'Direct Citizen Report',
        rawText: synthesizedRawText,
        language: language === 'Telugu' ? 'Telugu-English' : 'English',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemoConnector: isDemoSubmission,
      };

      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal: signalPayload }),
      });

      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
        if (data.incident) {
          setSubmittedIncidentId(data.incident.id);
        }
        onReportSubmitted();
      } else {
        setErrorMsg(data.error || 'Failed to submit emergency report');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err?.message || 'Network error communicating with ResQAI backend');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0e1424] to-[#070b16] border border-cyan-800/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI EMERGENCY TRIAGE & INCIDENT REPORTING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            {language === 'English' ? 'Report Emergency Incident' : 'అత్యవసర సంఘటన రిపోర్ట్ చేయండి'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'English'
              ? 'Describe an emergency in natural language. Google Gemini will classify the incident, assess urgency, extract landmarks, and generate instant safety instructions.'
              : 'సహజ భాషలో ప్రమాదాన్ని వివరించండి. గూగుల్ జెమినీ స్వయంచాలకంగా ప్రమాద తీవ్రతను అంచనా వేసి తక్షణ రక్షణ సూచనలను అందిస్తుంది.'}
          </p>
        </div>

        {/* Bilingual Language Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 p-1.5 rounded-xl border border-slate-700">
          <Languages className="w-4 h-4 text-cyan-400 ml-2" />
          <button
            onClick={() => setLanguage('English')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              language === 'English'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('Telugu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              language === 'Telugu'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            తెలుగు (Telugu)
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-300/90 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong>
            {language === 'English'
              ? 'IMPORTANT SAFETY & DISPATCH NOTICE:'
              : 'ముఖ్యమైన భద్రతా హెచ్చరిక:'}
          </strong>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {language === 'English'
              ? 'AI priority classifications and action checklists are decision-support estimates. ResQAI does NOT autonomously dispatch emergency vehicles or 911/112 units. For life-threatening crises requiring immediate physical response, call National Emergency 112 directly.'
              : 'ఈ అప్లికేషన్ ఇచ్చే అంచనాలు సహాయక సమాచారం మాత్రమే. ఇది నేరుగా అంబులెన్స్ లేదా పోలీసులను పంపించదు. ప్రాణాపాయం ఉన్నప్పుడు వెంటనే 112 లేదా 108 కు నేరుగా ఫోన్ చేయండి.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Form (Left) & AI Triage Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Reporting Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
            {/* Quick Scenario Fillers */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                {language === 'English' ? 'Quick Test Scenarios:' : 'త్వరిత పరీక్షా నమూనాలు:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPORT_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIncidentType(sample.type);
                      setDescription(sample.text);
                      handleSelectLandmark(sample.landmark);
                      setPeopleCount(sample.people);
                      setVulnerableCategories(sample.vuln);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Category */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {language === 'English' ? 'Incident Category:' : 'ప్రమాద రకం:'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'flood', label: 'Flood', icon: Waves, color: 'text-cyan-400' },
                  { id: 'fire', label: 'Fire', icon: Flame, color: 'text-rose-500' },
                  { id: 'medical', label: 'Medical', icon: HeartPulse, color: 'text-red-400' },
                  { id: 'accident', label: 'Accident', icon: Car, color: 'text-amber-400' },
                  { id: 'evacuation', label: 'Evac', icon: Building, color: 'text-orange-400' },
                  { id: 'other', label: 'Other', icon: AlertOctagon, color: 'text-slate-400' },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = incidentType === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setIncidentType(cat.id as IncidentType)}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-md shadow-cyan-950'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                      <span className="text-[11px] font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'English'
                    ? 'Incident Description (Natural Language):'
                    : 'ప్రమాద వివరాలు (వివరించండి):'}
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {language === 'English' ? 'EN / Telugu supported' : 'తెలుగు మరియు ఇంగ్లీష్ మద్దతు'}
                </span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'English'
                    ? 'E.g., Rising floodwaters entered houses behind Velachery MRTS. 10 people trapped on terrace including an elderly resident...'
                    : 'ఉదాహరణ: వేళచ్చేరి రైల్వే స్టేషన్ వెనుక నీరు చేరింది. 10 మంది మేడపై చిక్కుకున్నారు...'
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            {/* Location Assistance */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {language === 'English'
                      ? 'Location Assistance (Landmark Intelligence)'
                      : 'స్థల వివరాలు (మైలురాళ్లు)'}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleCopyLocation}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                  title="Copy location details"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Landmark Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    {language === 'English' ? 'Select Known Landmark:' : 'తెలిసిన మైలురాయి:'}
                  </label>
                  <select
                    value={selectedLandmark}
                    onChange={(e) => handleSelectLandmark(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Choose Indian Landmark --</option>
                    {KNOWN_LANDMARKS.map((lm, idx) => (
                      <option key={idx} value={lm.name}>
                        {lm.name} ({lm.area})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    {language === 'English' ? 'Specific Landmarks / Road:' : 'నిర్దిష్ట రోడ్డు లేదా భవనం:'}
                  </label>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="E.g., Near West Gate, Behind Station road..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 italic">
                * ResQAI calculates approximate landmark perimeters. We never fabricate GPS coordinates.
              </p>
            </div>

            {/* People & Vulnerable Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  {language === 'English'
                    ? 'Estimated People Trapped/Affected:'
                    : 'బాధిత వ్యక్తుల అంచనా సంఖ్య:'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  placeholder="E.g., 5"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  {language === 'English' ? 'Reporter Contact (Optional):' : 'సంప్రదింపు నంబర్ (ఐచ్ఛికం):'}
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="+91-XXXXXXXXXX (Privacy masked)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Vulnerable Persons Pills */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">
                {language === 'English'
                  ? 'Vulnerable Occupants Present:'
                  : 'ప్రత్యేక శ్రద్ధ అవసరమైన వారు:'}
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: 'elderly', label: 'Elderly Citizen (వృద్ధులు)' },
                  { id: 'infant', label: 'Infant / Child (పిల్లలు)' },
                  { id: 'pregnant', label: 'Pregnant Mother (గర్భిణీ)' },
                  { id: 'injured', label: 'Injured / Trauma (క్షతగాత్రులు)' },
                  { id: 'disabled', label: 'Mobility Impaired (దివ్యాంగులు)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleVulnerable(item.id)}
                    className={`px-2.5 py-1 rounded-lg border transition ${
                      vulnerableCategories.includes(item.id)
                        ? 'bg-rose-950 border-rose-600 text-rose-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Mode Toggle */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <input
                type="checkbox"
                id="demo-toggle"
                checked={isDemoSubmission}
                onChange={(e) => setIsDemoSubmission(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
              />
              <label htmlFor="demo-toggle" className="text-slate-300 cursor-pointer">
                <strong>Tag as Demo Simulation Record</strong> (Evaluator / Test submission)
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-700 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleAnalyzeAndSubmit}
              disabled={isAnalyzing || !description.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-950/60 border border-red-400/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>
                    {language === 'English'
                      ? 'ANALYZING & TRIAGING VIA GEMINI...'
                      : 'జెమినీ ద్వారా పరిశీలిస్తోంది...'}
                  </span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>
                    {language === 'English'
                      ? 'SUBMIT & RUN GEMINI AI TRIAGE'
                      : 'సమర్పించండి మరియు AI విశ్లేషణ పొందండి'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Triage Intelligence & Action Checklist */}
        <div className="lg:col-span-5 space-y-4">
          {submittedIncidentId && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/80 shadow-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Incident Persisted Successfully
                </span>
                <p className="text-[11px] text-slate-300 font-mono">
                  Assigned ID: <strong className="text-white">{submittedIncidentId}</strong>
                </p>
              </div>
              <button
                onClick={onNavigateToDashboard}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
              >
                View on Map →
              </button>
            </div>
          )}

          {analysisResult ? (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-800/80 shadow-2xl space-y-4 text-xs">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">AI TRIAGE ASSESSMENT</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      analysisResult.urgency === 'critical'
                        ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                        : analysisResult.urgency === 'high'
                        ? 'bg-amber-950 text-amber-400 border border-amber-700'
                        : 'bg-slate-900 text-cyan-300 border border-cyan-800'
                    }`}
                  >
                    {analysisResult.urgency}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[10px]">
                  {analysisResult.aiExecutionMode === 'live_gemini' ? 'LIVE GEMINI' : 'DEMO ENGINE'}
                </span>
              </div>

              {/* Status Message */}
              <div className="p-2.5 rounded-lg bg-slate-900 text-[11px] text-cyan-300 font-mono border border-slate-800">
                {analysisResult.aiStatusMessage}
              </div>

              {/* Concise AI Incident Summary */}
              {analysisResult.summary && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      Responder Briefing:
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(analysisResult.summary?.responderBrief || '');
                        setCopiedText(true);
                        setTimeout(() => setCopiedText(false), 2000);
                      }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                      Copy Brief
                    </button>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans">
                    {analysisResult.summary.responderBrief}
                  </p>
                </div>
              )}

              {/* Immediate Hazards */}
              {analysisResult.summary?.immediateRisks && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-1.5">
                  <span className="font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Immediate Hazards:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    {analysisResult.summary.immediateRisks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Checklist (Situation-Specific Instructions in Selected Language) */}
              {analysisResult.summary?.actionChecklist && (
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                      <LifeBuoy className="w-4 h-4 text-cyan-400" />
                      {language === 'English'
                        ? 'Action Checklist & Safety Steps:'
                        : 'రక్షణ మరియు భద్రతా సూచనలు:'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {language}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {analysisResult.summary.actionChecklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {item.step}
                        </span>
                        <div className="space-y-0.5 flex-1">
                          <p className="text-slate-200 leading-snug">
                            {language === 'Telugu' && item.instructionTelugu
                              ? item.instructionTelugu
                              : item.instruction}
                          </p>
                          <span className="text-[10px] uppercase font-mono text-slate-500">
                            Category: {item.category} • Priority: {item.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Emergency Contact Numbers */}
              {analysisResult.summary?.recommendedContacts && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Emergency Helplines:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.summary.recommendedContacts.map((contact, i) => (
                      <a
                        key={i}
                        href={`tel:${contact.number}`}
                        className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-700 transition flex items-center justify-between text-xs group"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-white block truncate">
                            {contact.service}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Verified 24/7
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-emerald-400 group-hover:scale-105 transition shrink-0">
                          {contact.number}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl text-center space-y-3 text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto text-cyan-500/50" />
              <h4 className="text-sm font-semibold text-slate-300">
                {language === 'English'
                  ? 'Awaiting Incident Submission'
                  : 'వివరాలు నమోదు కోసం వేచి చూస్తోంది'}
              </h4>
              <p className="text-xs max-w-sm mx-auto leading-relaxed text-slate-400">
                {language === 'English'
                  ? 'Fill out the form on the left or select a quick scenario. ResQAI will run Gemini AI triage, estimate priority, and generate instant situation-specific safety checklists.'
                  : 'ఎడమ వైపు ఉన్న ఫారమ్‌ను పూరించండి. జెమినీ ఏఐ తక్షణ రక్షణ సూచనలు మరియు అత్యవసర నంబర్లను చూపిస్తుంది.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
