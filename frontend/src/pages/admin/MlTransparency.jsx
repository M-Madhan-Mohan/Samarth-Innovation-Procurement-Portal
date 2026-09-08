import React, { useState, useEffect } from 'react';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { Cpu, CheckCircle2, ShieldAlert, BarChart3, Database } from 'lucide-react';
import { api } from '../../services/api';

export default function MlTransparency({ currentUser, onRoleChange }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.getMlTransparency();
      setModels(res);
    }
    load();
  }, []);

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-purple-400" /> AI & Machine Learning Transparency Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Model Version Registry, Benchmark Metrics, NDCG Scores, and Explainability Audits
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {models.map((m) => (
          <div key={m.model_id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">{m.model_id}</span>
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {m.status} ({m.version})
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Algorithm: {m.algorithm}</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">NDCG@5</span>
                  <span className="font-extrabold text-amber-400 text-sm">{m.ndcg_at_5}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Accuracy / F1</span>
                  <span className="font-extrabold text-emerald-400 text-sm">{m.accuracy}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Latency</span>
                  <span className="font-extrabold text-blue-400 text-sm">{m.inference_time_ms} ms</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </GovernmentLayout>
);
}
