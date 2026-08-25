import React from 'react';
import { Target, Plus, TrendingUp } from 'lucide-react';

const TargetSettings = () => {
  const targets = [
    { level: 'State Level', target: '₹5.00 Cr / Month', achieved: '₹4.20 Cr', status: '84%', color: 'bg-blue-600' },
    { level: 'District Level', target: '₹25.00 L / Month', achieved: '₹21.50 L', status: '86%', color: 'bg-indigo-600' },
    { level: 'Taluk Level', target: '₹5.00 L / Month', achieved: '₹3.80 L', status: '76%', color: 'bg-violet-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Target Allocation</h1>
          <p className="text-xs text-slate-500 mt-1">Set sales goals, quarterly KPIs, and track state achievements</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-4 h-4" /> Allocate New Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {targets.map((t) => (
          <div key={t.level} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.level}</span>
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl font-bold text-slate-900">{t.target}</div>
              <div className="text-xs text-slate-400 mt-0.5">Achieved: <span className="text-slate-700 font-semibold">{t.achieved}</span></div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Completion</span>
                <span className="text-blue-600">{t.status}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${t.color} rounded-full`} style={{ width: t.status }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetSettings;