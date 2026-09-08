import React, { useState, useEffect } from 'react';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { Database, RefreshCw, CheckCircle2, FileText, Download, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function DatasetCenter({ currentUser, onRoleChange }) {
  const [datasets, setDatasets] = useState([]);
  const [retraining, setRetraining] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getDatasets();
      setDatasets(res);
    }
    load();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    const res = await api.fetchApi("/mipp/ml/retrain", { method: "POST" });
    setRetraining(false);
    setRetrainMsg(res ? res.message : "Model retraining completed.");
  };

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-400" /> Admin Dataset & Ingestion Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real Public Open Datasets (data.gov.in, DPIIT, Transport Dept) & Provenance Management
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? "Retraining Models..." : "Retrain ML Pipeline"}</span>
        </button>
      </div>

      {retrainMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{retrainMsg}</span>
        </div>
      )}

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Ingested Datasets Registry</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4">Dataset ID</th>
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Source / Publisher</th>
                <th className="py-3 px-4">License</th>
                <th className="py-3 px-4">Rows</th>
                <th className="py-3 px-4">Provenance Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {datasets.map((d) => (
                <tr key={d.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{d.id}</td>
                  <td className="py-3 px-4 font-bold text-white">{d.name}</td>
                  <td className="py-3 px-4 text-slate-400">{d.source}</td>
                  <td className="py-3 px-4 text-slate-300">{d.license}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{d.rows?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      d.type === "REAL_PUBLIC" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}>
                      {d.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </GovernmentLayout>
);
}
