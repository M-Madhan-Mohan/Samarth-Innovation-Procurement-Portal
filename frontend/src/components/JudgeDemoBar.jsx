import React, { useState } from 'react';
import { Play, CheckCircle2, ChevronRight, Award, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

export const DEMO_STEPS = [
  { step: 1, title: 'Enter Problem', role: 'government', route: '/government/create-challenge', desc: 'Government enters Pune Traffic Problem Statement.' },
  { step: 2, title: 'AI Copilot Draft', role: 'government', route: '/government/create-challenge', desc: 'AI generates 23 outcome-based fields & KPIs.' },
  { step: 3, title: 'Quality Score 92/100', role: 'government', route: '/government/create-challenge', desc: 'Challenge Quality Assessment breakdown evaluated.' },
  { step: 4, title: 'AI Startup Match', role: 'government', route: '/government/startups', desc: 'Matching Engine scores startups (UrbanFlow 91%).' },
  { step: 5, title: 'Explain Match Score', role: 'government', route: '/government/startups', desc: 'Displays 7-dimension radar & Strengths/Weaknesses.' },
  { step: 6, title: 'Capability Passport', role: 'startup', route: '/startup/profile', desc: 'Inspects Startup Passport & Security Readiness.' },
  { step: 7, title: 'Blind Evaluation', role: 'evaluator', route: '/evaluator/evaluate/APP-2026-103', desc: 'Evaluator scores blind proposal without PII.' },
  { step: 8, title: 'Conflict Auto-Blocked', role: 'evaluator', route: '/evaluator/dashboard', desc: 'Evaluator conflict declared & assignment blocked.' },
  { step: 9, title: 'Pilot Awarded', role: 'government', route: '/government/control-tower', desc: 'Winning startup enters Pilot Control Tower.' },
  { step: 10, title: 'Control Tower & Tranches', role: 'government', route: '/government/control-tower', desc: 'Milestones (M1-M5) & simulated PFMS disbursement.' },
  { step: 11, title: '4-Way Evidence Verification', role: 'government', route: '/government/evidence-verification', desc: 'Claimed vs Govt vs Evaluator vs Validator comparison.' },
  { step: 12, title: 'Scale Readiness 92/100', role: 'government', route: '/government/scale-replication', desc: 'System outputs READY FOR SCALE decision.' },
  { step: 13, title: 'Cross-District Replication', role: 'government', route: '/government/scale-replication', desc: 'Recommends Nashik, Nagpur, Thane based on data similarity.' }
];

export default function JudgeDemoBar({ currentStep, onStepChange, onNavigate }) {
  const [isOpen, setIsOpen] = useState(true);

  const active = DEMO_STEPS.find(s => s.step === currentStep) || DEMO_STEPS[0];

  return (
    <div className="bg-white border-b border-slate-200 text-slate-700 px-4 py-2.5 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Samarth — SIH 2026 Demo
          </div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <span className="text-blue-600 font-mono">Step {active.step}/13:</span>
            <span>{active.title}</span>
          </div>
        </div>

        {/* Step Scroller */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full no-scrollbar">
          {DEMO_STEPS.map((s) => {
            const isDone = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <button
                key={s.step}
                onClick={() => {
                  onStepChange(s.step);
                  if (onNavigate) onNavigate(s.route, s.role);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-md scale-105'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-slate-50 text-slate-500 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="font-mono text-[10px]">{s.step}</span>}
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              onClick={() => {
                const nextStep = currentStep - 1;
                onStepChange(nextStep);
                const s = DEMO_STEPS.find(st => st.step === nextStep);
                if (s && onNavigate) onNavigate(s.route, s.role);
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
            >
              Prev
            </button>
          )}
          {currentStep < 13 && (
            <button
              onClick={() => {
                const nextStep = currentStep + 1;
                onStepChange(nextStep);
                const s = DEMO_STEPS.find(st => st.step === nextStep);
                if (s && onNavigate) onNavigate(s.route, s.role);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
