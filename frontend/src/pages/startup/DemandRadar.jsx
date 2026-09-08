import React, { useState, useEffect } from 'react';
import { Radar, Building2, MapPin, DollarSign, AlertCircle, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';

export default function StartupDemandRadar() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.fetchApi("/mipp/startups/demand-radar");
      if (res) setItems(res);
      else {
        setItems([
          { sector: "Urban Mobility & Traffic", open_challenges: 12, urgency: "High", budget_range: "₹50L - ₹1.5Cr", districts: ["Pune", "Thane", "Nagpur"] },
          { sector: "Agriculture & AgriTech", open_challenges: 18, urgency: "High", budget_range: "₹30L - ₹80L", districts: ["Yavatmal", "Nanded", "Kolhapur"] },
          { sector: "GovTech & Vernacular NLP", open_challenges: 15, urgency: "Medium", budget_range: "₹25L - ₹60L", districts: ["Statewide"] },
          { sector: "Healthcare & Diagnostics", open_challenges: 9, urgency: "High", budget_range: "₹40L - ₹1.0Cr", districts: ["Gadchiroli", "Nandurbar"] }
        ]);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Radar className="w-6 h-6 text-amber-400 animate-pulse" /> Government Demand Radar
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-Time Open Departmental Challenges & Innovation Procurement Demand across Maharashtra
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 transition">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{item.sector}</h3>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30">
                {item.open_challenges} Open Challenges
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Urgency Level</span>
                <span className="font-bold text-red-400">{item.urgency}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Budget Range</span>
                <span className="font-bold text-emerald-400">{item.budget_range}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Districts</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {item.districts?.map((d, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" /> {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
