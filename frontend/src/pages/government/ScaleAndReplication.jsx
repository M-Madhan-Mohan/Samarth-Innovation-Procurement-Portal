import React, { useState, useEffect } from 'react';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { Award, TrendingUp, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Building2 } from 'lucide-react';
import { api } from '../../services/api';

export default function ScaleAndReplication({ currentUser, onRoleChange }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getScaleAndReplication("PL-2026-PUNE-01");
      setData(res);
    }
    load();
  }, []);

  if (!data) return null;

  const sa = data.scale_assessment || {};
  const b = sa.breakdown || {};
  const recs = data.replication_recommendations || [];

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" /> Scale Readiness & Replication Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-Driven Procurement Scaling & Cross-District Innovation Replication across Maharashtra
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-sm rounded-full border border-emerald-500/40">
            DECISION: {sa.decision}
          </span>
        </div>
      </div>

      {/* Scale Readiness Scorecard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Scale Readiness Index</span>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-2">
              <span>{sa.scale_readiness_score}</span>
              <span className="text-sm text-slate-400 font-medium">/ 100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">KPI Score</span>
              <span className="font-bold text-emerald-300">{b.kpi_achievement} / 25</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Cost Score</span>
              <span className="font-bold text-amber-300">{b.cost_effectiveness} / 20</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Security</span>
              <span className="font-bold text-purple-300">{b.security_status} / 10</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Citizen Impact</span>
              <span className="font-bold text-blue-300">{b.citizen_impact} / 15</span>
            </div>
          </div>
        </div>

        {/* Reasons For Scale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Validated Justifications for Scaling
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {sa.reasons_for?.map((r, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Operational Limitations & Caveats
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {sa.weaknesses?.map((w, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Cross-District Replication Recommendations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" /> Maharashtra Cross-District Replication Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recs.map((r, idx) => (
            <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" /> District: {r.district}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                    {r.problem_similarity}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2">{r.reason}</p>
              </div>

              <div className="pt-3 border-t border-slate-900 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Expected Impact:</span>
                  <span className="font-bold text-emerald-400">{r.expected_impact}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Est. Budget:</span>
                  <span className="font-bold text-amber-400">{r.estimated_budget}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Readiness:</span>
                  <span className="font-bold text-blue-400">{r.readiness}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </GovernmentLayout>
);
}
