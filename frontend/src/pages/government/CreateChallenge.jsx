import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { DOMAIN_CATEGORIES } from '../../data/mockData';
import Button from '../../components/common/Button';
import { Sparkles, CheckCircle2, ArrowLeft, Send, FileText, Shield, Award, Cpu } from 'lucide-react';
import { api } from '../../services/api';

const SAMPLE_PROBLEMS = [
  "Waste collection vehicles in Nashik frequently miss collection routes, resulting in overflowing garbage bins and citizen complaints.",
  "Traffic congestion near schools in Pune is causing delays and safety problems during morning and evening peak hours.",
  "Rural PHCs in Gadchiroli and Nandurbar lack rapid blood biochemistry diagnostic kits, requiring samples to be dispatched 80km away.",
  "Aaple Sarkar citizen grievances in Marathi require manual sorting, causing up to 14 days delay."
];

const listValue = (value) => Array.isArray(value) ? value : value ? [value] : [];
const textValue = (value, fallback = 'Not specified') => Array.isArray(value) ? value.join('; ') : value || fallback;

const CreateChallenge = ({ currentUser, onRoleChange }) => {
  const navigate = useNavigate();

  const [rawProblem, setRawProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [generating, setGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  const [aiError, setAiError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    department: currentUser?.department || 'Department of Skills, Employment, Entrepreneurship & Innovation',
    domain: 'environment',
    budget: '₹ 65,00,000',
    pilotTimeline: '6 Months',
    deadline: '2026-11-30',
    targetDistricts: 'Nashik, Maharashtra',
    problemStatement: '',
    expectedOutcome: '',
    primaryKpi: '',
    baselineValue: '',
    targetValue: '',
    qualityScore: 90
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGenerateAi = async (e) => {
    e.preventDefault();
    if (rawProblem.trim().length < 20) {
      setAiError('Please describe the government problem in a little more detail.');
      return;
    }
    setGenerating(true);
    setAiError('');
    try {
      const draft = await api.generateChallengeCopilot(rawProblem);
      if (!draft) throw new Error('AI service is currently unavailable.');
      setAiDraft(draft);
    } catch (error) {
      setAiDraft(null);
      setAiError(error.message || 'AI service is currently unavailable.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAcceptAiDraft = () => {
    if (!aiDraft) return;
    setFormData({
      ...formData,
      title: aiDraft.title || '',
      department: aiDraft.issuing_department || aiDraft.department || formData.department,
      domain: aiDraft.domain === 'urban_services' ? 'urban_infra' : (aiDraft.domain || 'environment'),
      budget: aiDraft.pilot_budget || aiDraft.suggested_budget || 'To be determined',
      pilotTimeline: aiDraft.pilot_duration || `${aiDraft.pilot_duration_months || 6} Months`,
      problemStatement: aiDraft.problem_statement || rawProblem,
      expectedOutcome: textValue(aiDraft.desired_outcomes || aiDraft.desired_outcome, ''),
      primaryKpi: aiDraft.primary_kpi || aiDraft.key_performance_indicators?.[0]?.name || '',
      baselineValue: aiDraft.baseline_value || aiDraft.baseline_metrics?.[0] || '',
      targetValue: aiDraft.target_value || aiDraft.target_metrics?.[0] || '',
      qualityScore: aiDraft.quality_score || 0,
      brief: aiDraft
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      department: formData.department,
      domain: formData.domain,
      budget: formData.budget,
      pilot_timeline: formData.pilotTimeline,
      deadline: formData.deadline,
      status: "PUBLISHED",
      problem_statement: formData.problemStatement,
      desired_outcome: formData.expectedOutcome,
      primary_kpi: formData.primaryKpi || "Primary outcome",
      baseline_value: formData.baselineValue || "AI-suggested: to be validated",
      target_value: formData.targetValue || "Target to be validated during pilot",
      quality_score: formData.qualityScore || 90
    };

    const result = await api.createChallenge({ ...payload, brief: aiDraft || formData.brief || {} });
    if (!result) {
      setSubmitting(false);
      setAiError('Challenge could not be published. Please check the backend and retry.');
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/government/challenges');
    }, 1500);
  };

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <button
        onClick={() => navigate('/government/challenges')}
        className="text-blue-600 font-semibold text-xs flex items-center gap-1.5 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </button>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* AI Challenge Copilot Panel */}
        <div className="copilot-panel bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/50 border border-amber-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Challenge Copilot</h2>
              <p className="text-xs text-slate-400">Enter raw operational problems to generate structured outcome challenges & 23-field briefs</p>
            </div>
          </div>

          <form onSubmit={handleGenerateAi} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Raw Operational Problem Description
              </label>
              <textarea
                value={rawProblem}
                onChange={(e) => setRawProblem(e.target.value)}
                rows={3}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60 transition"
                placeholder="Describe any government problem..."
              />
            </div>

            {/* Quick Samples */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 self-center font-medium">Try Sample:</span>
              {SAMPLE_PROBLEMS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRawProblem(s)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                >
                  Sample {idx + 1}
                </button>
              ))}
            </div>

            {generating && (
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 space-y-2 text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> AI Copilot Synthesis in Progress...
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Understanding Problem
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Identifying Domain & Department
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Designing Quantifiable Outcomes
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Generating Measurable KPIs
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-600" /> Assessing Statutory Risks
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-600" /> Preparing Pilot Execution Plan
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={generating}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-xs"
              >
                {generating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Problem & Designing Brief...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>✨ GENERATE WITH AI</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {aiError && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-200">{aiError}</div>}

          {aiDraft && (
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-5 rounded-2xl border border-amber-500/30">
                <div><span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">AI Generated Challenge</span><h2 className="text-lg font-bold text-white mt-1">{aiDraft.title}</h2><p className="text-sm text-slate-300 mt-1">{aiDraft.short_summary}</p></div>
                <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-center min-w-[120px]"><span className="text-[10px] font-bold text-slate-400 uppercase block">Quality Score</span><span className="text-2xl font-extrabold text-emerald-400">{aiDraft.quality_score || 0} <span className="text-xs text-slate-500 font-normal">/ 100</span></span></div>
              </div>

              <div className="space-y-2 text-sm">
                <details open className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">1. Challenge Overview</summary><div className="grid sm:grid-cols-2 gap-3 pt-3 text-slate-300"><div><b>Department:</b> {aiDraft.issuing_department || aiDraft.department}</div><div><b>Domain:</b> {aiDraft.domain_sector || aiDraft.domain_label}</div><div><b>Solution:</b> {aiDraft.expected_solution_category || aiDraft.expected_solution_type}</div><div><b>Beneficiaries:</b> {textValue(aiDraft.target_beneficiaries)}</div></div></details>
                <details open className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">2. Problem</summary><div className="pt-3 space-y-2 text-slate-300"><p><b>Statement:</b> {aiDraft.problem_statement}</p><p><b>Current situation:</b> {aiDraft.current_situation}</p><p><b>Pain points:</b> {textValue(aiDraft.pain_points)}</p></div></details>
                <details className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">3. Outcomes</summary><ul className="pt-3 list-disc list-inside text-slate-300">{listValue(aiDraft.desired_outcomes).map((item, i) => <li key={i}>{item}</li>)}</ul></details>
                <details open className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">4. KPIs</summary><div className="overflow-x-auto pt-3"><table className="w-full text-left text-xs text-slate-300"><thead><tr className="text-slate-500"><th className="p-2">KPI</th><th className="p-2">Baseline</th><th className="p-2">Target</th><th className="p-2">Unit</th><th className="p-2">Measurement</th></tr></thead><tbody>{listValue(aiDraft.key_performance_indicators).map((item, i) => <tr key={i} className="border-t border-slate-800"><td className="p-2 font-semibold text-white">{item.name}</td><td className="p-2">{item.baseline}</td><td className="p-2 text-emerald-300">{item.target}</td><td className="p-2">{item.unit}</td><td className="p-2">{item.measurement_method}</td></tr>)}</tbody></table></div></details>
                <details open className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">5. Pilot</summary><div className="grid sm:grid-cols-2 gap-3 pt-3 text-slate-300"><div><b>Duration:</b> {aiDraft.pilot_duration}</div><div><b>Budget:</b> {aiDraft.pilot_budget}</div><div><b>Locations:</b> {textValue(aiDraft.target_locations)}</div><div><b>Scope:</b> {aiDraft.pilot_scope}</div><div className="sm:col-span-2"><b>Milestones:</b> {textValue(aiDraft.pilot_milestones)}</div></div></details>
                <details className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">6. Eligibility and Evaluation</summary><div className="grid sm:grid-cols-2 gap-4 pt-3 text-slate-300"><div><b>Eligibility</b><ul className="list-disc list-inside mt-2">{listValue(aiDraft.startup_eligibility).map((item, i) => <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>)}</ul></div><div><b>Evaluation (must total 100%)</b><ul className="mt-2">{listValue(aiDraft.evaluation_criteria).map((item, i) => <li key={i}>{item.criterion}: {item.weight}%</li>)}</ul></div></div></details>
                <details className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">7. Data and Security</summary><div className="grid sm:grid-cols-2 gap-4 pt-3 text-slate-300"><div><b>Required data</b><ul className="list-disc list-inside mt-2">{listValue(aiDraft.data_requirements).map((item, i) => <li key={i}>{typeof item === 'string' ? item : `${item.name} (${item.classification})`}</li>)}</ul></div><div><b>Cybersecurity</b><ul className="list-disc list-inside mt-2">{listValue(aiDraft.cybersecurity_requirements).map((item, i) => <li key={i}>{item}</li>)}</ul></div></div></details>
                <details className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">8. Risks</summary><ul className="pt-3 space-y-2 text-slate-300">{listValue(aiDraft.risks_and_mitigation).map((item, i) => <li key={i}><b>{item.risk || item}</b>{item.severity && ` (${item.severity})`}{item.mitigation && ` - ${item.mitigation}`}</li>)}</ul></details>
                <details className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"><summary className="font-bold text-white cursor-pointer">9. Evidence, Governance and Scale</summary><div className="pt-3 space-y-2 text-slate-300"><p><b>Evidence:</b> {textValue(aiDraft.evidence_and_success_criteria)}</p><p><b>Independent validation:</b> {aiDraft.independent_validation}</p><p><b>Success criteria:</b> {textValue(aiDraft.success_criteria || aiDraft.evidence_and_success_criteria)}</p><p><b>IP:</b> {aiDraft.ip_policy}</p><p><b>Data ownership:</b> {aiDraft.data_policy}</p><p><b>Payment milestones:</b> {textValue(aiDraft.payment_milestones)}</p><p><b>Scale criteria:</b> {textValue(aiDraft.scale_criteria)}</p><p><b>Compliance:</b> {textValue(aiDraft.compliance_requirements)}</p></div></details>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2"><button type="button" onClick={handleGenerateAi} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition">Regenerate</button><button type="button" onClick={handleAcceptAiDraft} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />Accept Draft & Populate Form</button></div>
            </div>
          )}
        </div>

        {/* Main Challenge Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
              Samarth Challenge Wizard
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-2">Publish State Innovation Challenge</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and finalize outcome metrics before publishing for startup discovery.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold text-slate-900">Challenge Successfully Published!</h2>
              <p className="text-xs text-slate-500">
                Your challenge has been saved and is now open for startup capability discovery.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Challenge Title / Problem Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Enabled Waste Collection Route Optimization for Nashik"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Issuing Department
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Target Domain Sector
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {DOMAIN_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Allocated Pilot Funding
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Pilot Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pilotTimeline}
                    onChange={(e) => setFormData({ ...formData, pilotTimeline: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Detailed Problem Statement & Pain Points
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Elaborate on current operational challenges..."
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Expected Solution Outcomes & Quantifiable Metrics
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Reduce missed collection routes to sub-5%..."
                  value={formData.expectedOutcome}
                  onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button variant="outline" type="button" onClick={() => navigate('/government/challenges')}>
                  Cancel
                </Button>
                <Button variant="saffron" type="submit" icon={Send} disabled={submitting}>
                  {submitting ? "Publishing..." : "PUBLISH STATE CHALLENGE"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </GovernmentLayout>
  );
};

export default CreateChallenge;
