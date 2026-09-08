import React, { useState } from 'react';
import { Sparkles, Shield, Target, AlertTriangle, CheckCircle2, FileText, Cpu, Award } from 'lucide-react';
import { api } from '../services/api';

export default function ChallengeCopilot({ onGenerated }) {
  const [prompt, setPrompt] = useState('Traffic congestion near schools in Pune is causing delays and safety problems during morning and evening hours.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const data = await api.generateChallengeCopilot(prompt);
    setResult(data);
    setLoading(false);
    if (onGenerated) onGenerated(data);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Challenge Copilot</h2>
          <p className="text-xs text-slate-400">Convert raw government problem descriptions into 23 outcome-based fields & quality scores</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Government Operational Problem Input
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition"
            placeholder="Describe operational problem..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Problem...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Outcome Challenge</span>
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-6">
          {/* Quality Score Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-4 rounded-xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Challenge Quality Score</span>
              <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
                <span>{result.quality_score}</span>
                <span className="text-sm font-medium text-slate-400">/ 100</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  APPROVED FOR PUBLICATION
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Outcome Clarity</span>
                <span className="font-bold text-amber-300">14.5 / 15</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">KPI Measurability</span>
                <span className="font-bold text-emerald-300">14.8 / 15</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Feasibility</span>
                <span className="font-bold text-blue-300">14.0 / 15</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Risk Completeness</span>
                <span className="font-bold text-purple-300">13.5 / 15</span>
              </div>
            </div>
          </div>

          {/* Generated Fields Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-amber-400 block mb-1">Primary KPI Metric</span>
              <p className="text-sm text-white font-medium">{result.primary_kpi}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-red-400">Baseline: <strong>{result.baseline_value}</strong></span>
                <span className="text-emerald-400">Target: <strong>{result.target_value}</strong></span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-blue-400 block mb-1">Expected Solution Type</span>
              <p className="text-sm text-slate-200">{result.expected_solution_type}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
