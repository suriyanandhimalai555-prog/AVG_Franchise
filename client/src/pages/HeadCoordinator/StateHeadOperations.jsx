import React from 'react';
import { MapPin, Users, Target, ShieldCheck } from 'lucide-react';

const StateHeadOperations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">State Head Operations & Reviews</h1>
        <p className="text-xs text-slate-500 mt-1">Direct managerial oversight and operational adherence per state leader</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-blue-600 block">Tamil Nadu State</span>
              <h3 className="text-base font-bold text-slate-900">R. Sundaram</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
              High Performing
            </span>
          </div>
          <p className="text-xs text-slate-500">Supervising 38 Districts, 420 Franchises, 12 Sales Managers.</p>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div><span className="text-slate-400 block text-[10px]">Collection</span><strong className="text-emerald-600">₹4.00 Cr</strong></div>
            <div><span className="text-slate-400 block text-[10px]">Target</span><strong className="text-slate-800">105%</strong></div>
            <div><span className="text-slate-400 block text-[10px]">Compliance</span><strong className="text-blue-600">98%</strong></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-blue-600 block">Karnataka State</span>
              <h3 className="text-base font-bold text-slate-900">A. Rao</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
              High Performing
            </span>
          </div>
          <p className="text-xs text-slate-500">Supervising 31 Districts, 380 Franchises, 10 Sales Managers.</p>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div><span className="text-slate-400 block text-[10px]">Collection</span><strong className="text-emerald-600">₹3.60 Cr</strong></div>
            <div><span className="text-slate-400 block text-[10px]">Target</span><strong className="text-slate-800">108.5%</strong></div>
            <div><span className="text-slate-400 block text-[10px]">Compliance</span><strong className="text-blue-600">96%</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateHeadOperations;