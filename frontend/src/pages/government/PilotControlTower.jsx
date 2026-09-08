import React, { useState, useEffect } from 'react';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { ShieldCheck, Play, DollarSign, Clock, AlertTriangle, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function PilotControlTower({ currentUser, onRoleChange }) {
  const [pilot, setPilot] = useState(null);
  const [disbursing, setDisbursing] = useState(null);
  const [disbursed, setDisbursed] = useState({});

  useEffect(() => {
    async function load() {
      const data = await api.getPilotDetails("PL-2026-PUNE-01");
      setPilot(data);
    }
    load();
  }, []);

  const handleDisburse = async (milestoneId) => {
    setDisbursing(milestoneId);
    const res = await api.fetchApi(`/mipp/pilots/PL-2026-PUNE-01/milestones/${milestoneId}/release-payment`, { method: "POST" });
    setDisbursing(null);
    setDisbursed({ ...disbursed, [milestoneId]: true });
  };

  if (!pilot) return null;

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Pilot Control Tower</h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              STATUS: DEPLOYMENT (RAG: GREEN)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Challenge: {pilot.challenge_title} • Department: {pilot.department}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Total Budget</span>
            <span className="text-base font-extrabold text-amber-400">₹ 1,20,00,000</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Amount Released</span>
            <span className="text-base font-extrabold text-emerald-400">₹ 48,00,000</span>
          </div>
        </div>
      </div>

      {/* Progress & Milestone Tranches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Milestones List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Milestone Payment Tranches</h2>

          <div className="space-y-3">
            {pilot.milestones.map((m) => {
              const isDisbursed = m.payment_status === "RELEASED" || disbursed[m.id];
              return (
                <div key={m.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{m.id}</span>
                      <h3 className="text-sm font-bold text-white">{m.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        m.rag === "GREEN" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {m.rag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Tranche: {m.percentage}% (₹ {(m.amount / 100000).toFixed(1)} Lakhs) • Due: {m.due_date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isDisbursed ? (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Released (PFMS Sim)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDisburse(m.id)}
                        disabled={disbursing === m.id}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow transition flex items-center gap-1"
                      >
                        {disbursing === m.id ? "Processing..." : "Disburse Tranche"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live KPI Performance Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Observed KPI Performance</h2>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 block uppercase">Primary Pilot KPI</span>
            <p className="text-sm font-bold text-white">{pilot.kpi_performance.metric}</p>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-400 block">Baseline</span>
                <span className="font-bold text-red-400">{pilot.kpi_performance.baseline}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target</span>
                <span className="font-bold text-blue-400">{pilot.kpi_performance.target}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-400">Current Observed:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{pilot.kpi_performance.current_observed}</span>
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl text-xs space-y-1">
            <span className="font-bold text-emerald-400 block">KPI Achievement Ratio</span>
            <span className="text-2xl font-extrabold text-white">{pilot.kpi_performance.achievement_pct}%</span>
            <p className="text-slate-400">Exceeds pilot target milestone requirements cleanly.</p>
          </div>
        </div>
      </div>
    </div>
  </GovernmentLayout>
);
}
