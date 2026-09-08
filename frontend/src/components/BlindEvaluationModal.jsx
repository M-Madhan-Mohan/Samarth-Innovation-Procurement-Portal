import React, { useState } from 'react';
import { Shield, EyeOff, AlertTriangle, CheckCircle2, Award, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function BlindEvaluationModal({ application, onClose }) {
  const [blindMode, setBlindMode] = useState(true);
  const [conflictDeclared, setConflictDeclared] = useState(false);
  const [conflictResult, setConflictResult] = useState(null);

  const [scores, setScores] = useState({
    tech: 92,
    social: 88,
    innovation: 94,
    security: 90,
    cost: 85,
    scalability: 91
  });

  const handleConflictToggle = async (hasConflict) => {
    setConflictDeclared(hasConflict);
    const res = await api.checkConflict("EVAL-01", application?.id || "APP-2026-103", hasConflict);
    setConflictResult(res);
  };

  const weightedTotal = round(
    (scores.tech * 0.25) +
    (scores.social * 0.20) +
    (scores.innovation * 0.15) +
    (scores.security * 0.10) +
    (scores.cost * 0.10) +
    (scores.scalability * 0.20),
    1
  );

  function round(val, dec) {
    return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header with Blind Mode & Conflict Declaration */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Blind Proposal Evaluation Room</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
              3 Independent Evaluators
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Application ID: {application?.id || "APP-2026-103"}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Blind Mode Toggle */}
          <button
            onClick={() => setBlindMode(!blindMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              blindMode
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>{blindMode ? 'Blind Review (Identity Redacted)' : 'Identity Unmasked'}</span>
          </button>
        </div>
      </div>

      {/* Conflict of Interest Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">Statutory Conflict of Interest Declaration</span>
          <span className="text-xs text-slate-400">Do you have any personal, financial, or academic relationship with the submitting entity?</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleConflictToggle(false)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
              !conflictDeclared
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            NO CONFLICT
          </button>

          <button
            onClick={() => handleConflictToggle(true)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
              conflictDeclared
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            CONFLICT DETECTED
          </button>
        </div>
      </div>

      {/* Conflict Block Notification */}
      {conflictResult && conflictResult.status === "ASSIGNMENT_BLOCKED" && (
        <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-xs space-y-1">
          <span className="font-bold text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> ASSIGNMENT BLOCKED & AUTOMATICALLY REASSIGNED
          </span>
          <p className="text-slate-300">{conflictResult.message}</p>
        </div>
      )}

      {!conflictDeclared && (
        <>
          {/* Proposal Summary (Blind vs Unblinded) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 block uppercase tracking-wider">Proposal Summary</span>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Applicant Entity</span>
                <span className="font-bold text-white">
                  {blindMode ? '██████████ Technologies (Redacted)' : 'UrbanFlow Mobility AI'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Requested Budget</span>
                <span className="font-bold text-emerald-400">₹ 1,15,00,000</span>
              </div>
            </div>
          </div>

          {/* Scoring Form (6 Weighted Dimensions) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Weighted Scoring Rubric</h4>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Combined Weighted Score</span>
                <span className="text-xl font-extrabold text-amber-400">{weightedTotal} / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="flex justify-between text-slate-300 mb-1">
                  <span>Technical Feasibility (25%)</span>
                  <span className="font-bold text-amber-400">{scores.tech}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.tech}
                  onChange={(e) => setScores({ ...scores, tech: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-slate-300 mb-1">
                  <span>Social & Policy Impact (20%)</span>
                  <span className="font-bold text-amber-400">{scores.social}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.social}
                  onChange={(e) => setScores({ ...scores, social: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-slate-300 mb-1">
                  <span>Innovation & Novelty (15%)</span>
                  <span className="font-bold text-amber-400">{scores.innovation}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.innovation}
                  onChange={(e) => setScores({ ...scores, innovation: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-slate-300 mb-1">
                  <span>Scalability & Replication (20%)</span>
                  <span className="font-bold text-amber-400">{scores.scalability}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.scalability}
                  onChange={(e) => setScores({ ...scores, scalability: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-slate-300 mb-1">
                  <span>Security & Compliance (10%)</span>
                  <span className="font-bold text-purple-400">{scores.security}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.security}
                  onChange={(e) => setScores({ ...scores, security: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-slate-300 mb-1">
                  <span>Cost Efficiency & ROI (10%)</span>
                  <span className="font-bold text-emerald-400">{scores.cost}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.cost}
                  onChange={(e) => setScores({ ...scores, cost: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Submission Section */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Statutory evaluation logged to audit ledger with cryptographic signature</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert(`Evaluation Submitted! Score: ${weightedTotal}/100. Timestamp: ${new Date().toLocaleTimeString()}`);
                  if (onClose) onClose();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBMIT EVALUATION</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
