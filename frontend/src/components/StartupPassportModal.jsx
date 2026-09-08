import React from 'react';
import { X, Award, ShieldCheck, CheckCircle2, FileText, Building2, MapPin, Globe } from 'lucide-react';

export default function StartupPassportModal({ passport, onClose }) {
  if (!passport) return null;

  const v = passport.verified_pilot_passport || {};
  const s = passport.scores || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Passport Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 font-extrabold text-xl flex items-center justify-center border border-amber-500/30">
            ST
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{passport.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Verified Passport
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span>DPIIT: <strong>{passport.dpiit_number}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {passport.location}</span>
            </p>
          </div>
        </div>

        {/* Readiness Scores Grid */}
        <div className="py-6 border-b border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">Capability & Readiness Scores</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Technical Readiness</span>
              <span className="text-xl font-extrabold text-blue-400">{s.technical_readiness}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Government Readiness</span>
              <span className="text-xl font-extrabold text-amber-400">{s.government_readiness}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Pilot Readiness</span>
              <span className="text-xl font-extrabold text-emerald-400">{s.pilot_readiness}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Security Readiness</span>
              <span className="text-xl font-extrabold text-purple-400">{s.security_readiness}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Deployment Capacity</span>
              <span className="text-xl font-extrabold text-teal-400">{s.deployment_readiness}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Operational Score</span>
              <span className="text-xl font-extrabold text-indigo-400">{s.operational_readiness}%</span>
            </div>
          </div>
        </div>

        {/* Verified Pilot Passport Section */}
        {v.pilot_id && (
          <div className="pt-6">
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Verified Pilot Passport Record
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {v.recommendation}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{v.challenge}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">KPI Achievement</span>
                  <span className="font-bold text-emerald-300">{v.kpi_achievement}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Timeline</span>
                  <span className="font-bold text-blue-300">{v.timeline}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Security Audit</span>
                  <span className="font-bold text-purple-300">{v.security}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Independent Val.</span>
                  <span className="font-bold text-amber-300">{v.independent_validation}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
