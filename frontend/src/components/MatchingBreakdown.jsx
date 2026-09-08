import React from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, MapPin, DollarSign, Users } from 'lucide-react';

export default function MatchingBreakdown({ match }) {
  if (!match) return null;

  const b = match.breakdown || {};

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{match.name}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              {match.sector}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">DPIIT Recognized Startup • Pune, Maharashtra</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Overall Match Score</span>
            <span className="text-2xl font-extrabold text-amber-400">{match.overall_score}%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-lg flex items-center justify-center border border-amber-500/30">
            {match.overall_score}
          </div>
        </div>
      </div>

      {/* 7-Dimension Breakdown Bars */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Explainable Score Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-400"/> Tech Match</span>
              <span className="font-bold text-amber-300">{b.tech_match} / 30</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(b.tech_match / 30) * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-purple-400"/> Domain Fit</span>
              <span className="font-bold text-amber-300">{b.domain_match} / 20</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(b.domain_match / 20) * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400"/> Pilot Readiness</span>
              <span className="font-bold text-amber-300">{b.pilot_readiness} / 15</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(b.pilot_readiness / 15) * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-teal-400"/> Security Readiness</span>
              <span className="font-bold text-amber-300">{b.security_readiness} / 10</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: `${(b.security_readiness / 10) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
          <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Match Strengths
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {match.strengths?.map((s, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4">
          <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Potential Weaknesses
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {match.weaknesses?.map((w, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">-</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
