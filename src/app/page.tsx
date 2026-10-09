'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar, { ActiveTab } from '@/components/layout/Navbar';
import HeroBanner from '@/components/dashboard/HeroBanner';
import KpiCards from '@/components/dashboard/KpiCards';
import EmergencyMap from '@/components/map/EmergencyMap';
import IncidentList from '@/components/dashboard/IncidentList';
import BottomPanel from '@/components/dashboard/BottomPanel';
import IncidentDetailModal from '@/components/dashboard/IncidentDetailModal';
import LiveDemoModal from '@/components/demo/LiveDemoModal';
import LiveIngestionConsole from '@/components/ingestion/LiveIngestionConsole';
import IncidentReportView from '@/components/report/IncidentReportView';
import ResponderView from '@/components/responder/ResponderView';
import EmergencyResourceDirectory from '@/components/resources/EmergencyResourceDirectory';
import AnalyticsView from '@/components/analytics/AnalyticsView';
import AboutArchitectureView from '@/components/about/AboutArchitectureView';
import JudgeModeView from '@/components/judge/JudgeModeView';
import { Incident, EmergencySignal } from '@/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [rawReports, setRawReports] = useState<EmergencySignal[]>([]);
  const [noiseCount, setNoiseCount] = useState<number>(0);
  const [stats, setStats] = useState({
    activeIncidents: 0,
    critical: 0,
    peopleAffected: 0,
    rescueInProgress: 0,
    resolved: 0,
    unverified: 0,
    totalRaw: 0,
    noiseCount: 0,
    incidentCount: 0,
    duplicates: 0,
  });
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [detailModalIncident, setDetailModalIncident] = useState<Incident | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Incidents & Stats
  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch('/api/incidents');
      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents || []);
        setRawReports(data.rawReports || []);
        setNoiseCount(data.stats?.noiseCount || 0);
        setStats(data.stats);

        // Keep selected incident synced
        if (selectedIncident) {
          const updated = data.incidents.find((i: Incident) => i.id === selectedIncident.id);
          if (updated) setSelectedIncident(updated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    }
  }, [selectedIncident]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Load Demo Benchmark Data
  async function handleLoadDemoData() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_full' }),
      });
      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents);
        setStats(data.stats);
        await fetchIncidents();
      }
    } catch (err) {
      console.error('Failed to load demo data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Reset Incidents
  async function handleReset() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (data.success) {
        setIncidents([]);
        setSelectedIncident(null);
        await fetchIncidents();
      }
    } catch (err) {
      console.error('Failed to reset:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectIncident(inc: Incident) {
    setSelectedIncident(inc);
    setDetailModalIncident(inc);
  }

  function handleSelectIncidentOnMap(inc: Incident) {
    setSelectedIncident(inc);
    setActiveTab('dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartLiveDemo={() => setIsDemoModalOpen(true)}
        onLoadDemoData={handleLoadDemoData}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: OPERATIONS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero / Architecture Banner */}
            <HeroBanner
              onStartLiveDemo={() => setIsDemoModalOpen(true)}
              onOpenDashboard={() => setActiveTab('dashboard')}
              onTryAiAnalysis={() => setActiveTab('report')}
            />

            {/* KPI Triage Cards */}
            <KpiCards stats={stats} />

            {/* Map & Incident List 2-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Leaflet Map */}
              <div className="lg:col-span-7 h-[580px] w-full">
                <EmergencyMap
                  incidents={incidents}
                  selectedIncident={selectedIncident}
                  onSelectIncident={handleSelectIncident}
                />
              </div>

              {/* Right Column: Synthesized Incident List */}
              <div className="lg:col-span-5 h-[580px] w-full">
                <IncidentList
                  incidents={incidents}
                  selectedIncident={selectedIncident}
                  onSelectIncident={handleSelectIncident}
                />
              </div>
            </div>

            {/* Bottom Panel: What Changed, AI Evidence, Raw Signals */}
            <BottomPanel
              selectedIncident={selectedIncident}
              allIncidents={incidents}
              rawReports={rawReports}
            />
          </div>
        )}

        {/* TAB 2: CITIZEN REPORT / AI TRIAGE */}
        {activeTab === 'report' && (
          <IncidentReportView
            onReportSubmitted={fetchIncidents}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* TAB 3: TACTICAL RESPONDER COMMAND */}
        {activeTab === 'responder' && (
          <ResponderView
            incidents={incidents}
            onStatusUpdated={fetchIncidents}
            onSelectIncidentOnMap={handleSelectIncidentOnMap}
          />
        )}

        {/* TAB 4: EMERGENCY RESOURCE DIRECTORY */}
        {activeTab === 'resources' && <EmergencyResourceDirectory />}

        {/* TAB 5: LIVE INGESTION CONSOLE */}
        {activeTab === 'ingestion' && (
          <LiveIngestionConsole onSignalIngested={fetchIncidents} />
        )}

        {/* TAB 6: ANALYTICS & METRICS */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            incidents={incidents}
            rawReports={rawReports}
            noiseCount={noiseCount}
          />
        )}

        {/* TAB 7: ABOUT & ARCHITECTURE */}
        {activeTab === 'about' && <AboutArchitectureView />}

        {/* TAB 8: JUDGE MODE WALKTHROUGH */}
        {activeTab === 'judge' && (
          <JudgeModeView
            onStartLiveDemo={() => setIsDemoModalOpen(true)}
            onLoadDemoData={handleLoadDemoData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 bg-slate-950 mt-12 text-center text-xs text-slate-500 font-mono space-y-1">
        <p>
          ResQAI – AI Emergency Response Assistant • &ldquo;From scattered signals to one clear emergency.&rdquo;
        </p>
        <p className="text-[11px] text-slate-600">
          Strict Single-AI Architecture Powered by Google Gemini API • Advisory Dispatch Only (Human in the loop)
        </p>
      </footer>

      {/* Full Incident Detail Modal */}
      <IncidentDetailModal
        incident={detailModalIncident}
        onClose={() => setDetailModalIncident(null)}
        onStatusUpdated={fetchIncidents}
      />

      {/* Live Demo Simulation Modal */}
      <LiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onStepProcessed={fetchIncidents}
      />
    </div>
  );
}
