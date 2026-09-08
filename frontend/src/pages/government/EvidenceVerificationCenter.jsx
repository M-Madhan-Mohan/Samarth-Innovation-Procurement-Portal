import React, { useState, useEffect } from 'react';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { ShieldCheck, FileCheck, CheckCircle2, AlertCircle, FileText, Cpu, Lock } from 'lucide-react';
import { api } from '../../services/api';

export default function EvidenceVerificationCenter({ currentUser, onRoleChange }) {
  const [evidence, setEvidence] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await api.getEvidenceVerification("PL-2026-PUNE-01");
      setEvidence(data);
    }
    load();
  }, []);

  if (!evidence) return null;

  const v = evidence.verification || {};

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Evidence Verification Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            4-Way Multi-Source Data Comparison & SHA-256 Audit Integrity Verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
            CONFIDENCE: {v.confidence}
          </span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
            STATUS: {v.status}
          </span>
        </div>
      </div>

      {/* SHA-256 File Metadata */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Submitted Evidence Artifact</span>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mt-1">
            <FileText className="w-4 h-4 text-blue-400" /> {evidence.evidence_file}
          </h3>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-400">
          <span className="text-slate-500 block text-[10px] uppercase font-sans font-bold">SHA-256 Checksum</span>
          <span className="text-emerald-400 break-all">{evidence.sha256_checksum}</span>
        </div>
      </div>

      {/* 4-Way Comparison Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">4-Way Data Source Comparison Matrix</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4">Data Source Category</th>
                <th className="py-3 px-4">Source Classification</th>
                <th className="py-3 px-4">Reported Delay Reduction</th>
                <th className="py-3 px-4">Trust Level Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr className="bg-slate-950/40">
                <td className="py-3 px-4 font-bold text-white">1. Startup Claimed Result</td>
                <td className="py-3 px-4 text-slate-400">Startup Telemetry Upload</td>
                <td className="py-3 px-4 font-bold text-amber-400">{v.claimed_result}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Self-Reported</span></td>
              </tr>
              <tr className="bg-emerald-950/20">
                <td className="py-3 px-4 font-bold text-emerald-300">2. Government Observed Data</td>
                <td className="py-3 px-4 text-slate-300">Municipal ITMS Sensors</td>
                <td className="py-3 px-4 font-bold text-emerald-400">{v.observed_result}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Primary Ground Truth</span></td>
              </tr>
              <tr className="bg-slate-950/40">
                <td className="py-3 px-4 font-bold text-white">3. Domain Evaluator Score</td>
                <td className="py-3 px-4 text-slate-400">Technical Expert Audit</td>
                <td className="py-3 px-4 font-bold text-blue-400">{v.evaluator_result}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Secondary Review</span></td>
              </tr>
              <tr className="bg-purple-950/20">
                <td className="py-3 px-4 font-bold text-purple-300">4. Independent Validator (COEP)</td>
                <td className="py-3 px-4 text-slate-300">Academic Committee Audit</td>
                <td className="py-3 px-4 font-bold text-purple-400">{v.validator_result}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Statutory Validation</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verified Result Banner */}
        <div className="mt-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Final Verified Result Metric</span>
            <div className="text-2xl font-extrabold text-white mt-1">{v.verified_result}</div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs text-slate-300 font-semibold">Government Verified & Audit Cleared</span>
          </div>
        </div>
      </div>
    </div>
  </GovernmentLayout>
);
}
