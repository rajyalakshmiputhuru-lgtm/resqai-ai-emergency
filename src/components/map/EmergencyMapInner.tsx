'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident } from '@/types';

interface EmergencyMapInnerProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export default function EmergencyMapInner({
  incidents,
  selectedIncident,
  onSelectIncident,
}: EmergencyMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Chennai Metropolitan Area by default
    const map = L.map(mapContainerRef.current, {
      center: [13.02, 80.22],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark OpenStreetMap CartoDB DarkMatter tiles
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Approximate Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    incidents.forEach((incident) => {
      const lat = incident.location.latitude;
      const lng = incident.location.longitude;
      if (!lat || !lng) return;

      const isCritical = incident.urgency === 'critical';
      const isSelected = selectedIncident?.id === incident.id;
      const isResolved = incident.status === 'resolved';

      // Pick badge colors
      let markerColor = '#ef4444'; // Red for critical/high
      let pulseClass = isCritical ? 'pulse-radar-red' : '';

      if (isResolved) {
        markerColor = '#10b981';
        pulseClass = '';
      } else if (incident.urgency === 'medium') {
        markerColor = '#f59e0b';
        pulseClass = 'pulse-radar-amber';
      }

      // Draw Approximate Radius Circle (Never faking exact pinpoint)
      if (incident.location.isApproximate) {
        L.circle([lat, lng], {
          radius: 500, // 500m approximate landmark perimeter
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 6',
        }).addTo(markersLayer);
      }

      // Custom HTML Marker Icon
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform hover:scale-125 ${
            isCritical ? 'pulse-radar-red' : ''
          }" style="background-color: ${markerColor}; border: 2px solid ${
        isSelected ? '#38bdf8' : '#ffffff'
      };">
            ${incident.incidentType === 'flood' ? '🌊' : incident.incidentType === 'fire' ? '🔥' : incident.incidentType === 'accident' ? '🚗' : incident.incidentType === 'medical' ? '⚕️' : '⚠️'}
          </div>
          <span class="absolute -bottom-6 px-1.5 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono text-slate-200 border border-slate-700 whitespace-nowrap shadow-md">
            ${incident.id}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-emergency-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(
        markersLayer
      );

      // Popup Content
      const popupHtml = `
        <div class="p-1 space-y-2 text-slate-100 max-w-xs font-sans">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span class="font-bold text-sm tracking-wide text-white">${incident.id} • ${incident.incidentType.toUpperCase()}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isCritical
                ? 'bg-red-950/80 text-red-400 border border-red-700'
                : isResolved
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700'
                : 'bg-amber-950/80 text-amber-400 border border-amber-700'
            }">
              ${incident.urgency}
            </span>
          </div>

          <div class="text-xs text-slate-300">
            <div class="font-semibold text-white">${incident.location.normalized}</div>
            <div class="mt-1 flex items-center gap-1.5">
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                📍 APPROXIMATE LOCATION (${Math.round((incident.location.confidence || 0.85) * 100)}%)
              </span>
            </div>
          </div>

          <div class="text-xs text-slate-400 grid grid-cols-2 gap-1 pt-1 border-t border-slate-800/60">
            <div>People: <strong class="text-white">${incident.people.affected ?? 'Unknown'}</strong></div>
            <div>Status: <strong class="text-white capitalize">${incident.status.replace(/_/g, ' ')}</strong></div>
          </div>

          <button id="btn-select-${incident.id}" class="w-full mt-2 py-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1 shadow">
            Inspect Incident →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${incident.id}`);
        if (btn) {
          btn.onclick = () => onSelectIncident(incident);
        }
      });

      marker.on('click', () => {
        onSelectIncident(incident);
      });
    });

    // Fly to selected incident if specified
    if (
      selectedIncident &&
      selectedIncident.location.latitude &&
      selectedIncident.location.longitude
    ) {
      map.flyTo(
        [
          selectedIncident.location.latitude,
          selectedIncident.location.longitude,
        ],
        13,
        { duration: 1.2 }
      );
    }
  }, [incidents, selectedIncident, onSelectIncident]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 shadow-xl text-xs space-y-1.5 pointer-events-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Geospatial Telemetry
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Critical Emergency</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Active / High Urgency</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Resolved</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono border-t border-slate-800 pt-1">
          <span className="w-3 h-3 border border-dashed border-cyan-400 rounded-full inline-block"></span>
          <span>Approximate Area (Landmark)</span>
        </div>
      </div>
    </div>
  );
}
