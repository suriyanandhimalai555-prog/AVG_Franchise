import React from 'react';
import { MapPin, Plus, Search, Layers, ChevronRight } from 'lucide-react';

const TerritoryManagement = () => {
  const territories = [
    { state: 'Karnataka', districts: 31, taluks: 240, activeFranchises: 1240, head: 'Rajesh Sharma' },
    { state: 'Maharashtra', districts: 36, taluks: 358, activeFranchises: 1890, head: 'Amit Verma' },
    { state: 'Tamil Nadu', districts: 38, taluks: 315, activeFranchises: 980, head: 'Suresh Kumar' },
    { state: 'Kerala', districts: 14, taluks: 77, activeFranchises: 672, head: 'Priya Nair' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Territory Allocation</h1>
          <p className="text-xs text-slate-500 mt-1">Hierarchical mapping across State, District, and Taluk boundaries</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-4 h-4" /> Add Territory Boundary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {territories.map((t) => (
          <div key={t.state} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.state}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Head: {t.head}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Districts</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{t.districts}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Taluks</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{t.taluks}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Franchises</div>
                <div className="text-sm font-bold text-emerald-600 mt-0.5">{t.activeFranchises}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerritoryManagement;