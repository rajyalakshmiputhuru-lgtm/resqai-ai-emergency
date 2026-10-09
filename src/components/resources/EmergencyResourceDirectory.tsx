'use client';

import React, { useState, useMemo } from 'react';
import { VERIFIED_EMERGENCY_CONTACTS } from '@/lib/data/emergency-directory';
import { VerifiedEmergencyContact } from '@/types';
import {
  Phone,
  Search,
  ShieldCheck,
  AlertTriangle,
  Building,
  HeartPulse,
  Flame,
  LifeBuoy,
  Users,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function EmergencyResourceDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const filteredContacts = useMemo(() => {
    return VERIFIED_EMERGENCY_CONTACTS.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.service.toLowerCase().includes(q);
        const matchesNum = item.number.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesNum && !matchesDesc) return false;
      }

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'national' && item.category !== 'national') return false;
        if (selectedCategory === 'medical' && item.category !== 'medical') return false;
        if (selectedCategory === 'disaster' && item.category !== 'disaster') return false;
        if (selectedCategory === 'city' && item.category !== 'city') return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  function handleCopyNumber(num: string) {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Directory Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0a1628] to-slate-950 border border-emerald-800/50 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>VERIFIED EMERGENCY RESOURCE DIRECTORY</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white font-mono tracking-tight">
          Official Emergency Contacts
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Pre-configured, government-verified emergency response numbers across India.
          All numbers are certified 24x7 crisis hotlines for police, fire, ambulance, disaster response, and municipal control desks.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by emergency service, number, or keyword..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="sm:col-span-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'national', label: 'National' },
              { id: 'medical', label: 'Medical (108/102)' },
              { id: 'disaster', label: 'Disaster (NDRF/SDMA)' },
              { id: 'city', label: 'Metro Desks' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between gap-4 transition group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition">
                    {contact.service}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      VERIFIED OFFICIAL
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {contact.hours}
                    </span>
                  </div>
                </div>

                {/* Dial Number Badge */}
                <span className="font-mono font-black text-xl text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/80 shrink-0">
                  {contact.number}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {contact.description}
              </p>

              {contact.descriptionTelugu && (
                <p className="text-xs text-slate-400 italic font-sans leading-relaxed pt-1 border-t border-slate-800/60">
                  {contact.descriptionTelugu}
                </p>
              )}
            </div>

            {/* Action Buttons: Direct Call & Copy */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <a
                href={`tel:${contact.number}`}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>CALL NOW ({contact.number})</span>
              </a>

              <button
                onClick={() => handleCopyNumber(contact.number)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Copy phone number"
              >
                {copiedNumber === contact.number ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Citizen Safety Protocols Box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
          <LifeBuoy className="w-4 h-4" />
          When to Contact Emergency Services (Dispatcher Guide)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-red-400 block font-mono">CALL 112 / 101 IMMEDIATELY:</strong>
            <p className="text-slate-400 text-[11px]">
              Active fire, trapped occupants, rising floodwaters crossing ground floors, structural collapses, or multi-vehicle highway collisions.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-amber-400 block font-mono">CALL 108 / 102 (MEDICAL):</strong>
            <p className="text-slate-400 text-[11px]">
              Severe trauma, active bleeding, unconscious individuals, chest pain, stroke symptoms, or pregnant mothers requiring immediate delivery transit.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-cyan-400 block font-mono">CALL 1070 / MUNICIPAL 1913:</strong>
            <p className="text-slate-400 text-[11px]">
              Neighborhood stormwater overflow, tree falls blocking evacuation arteries, or district-level relief camp shelter information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
