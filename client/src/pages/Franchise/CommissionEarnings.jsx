import React from 'react';
import { Percent, IndianRupee, Calendar, CheckCircle2 } from 'lucide-react';

const CommissionEarnings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Commission Earnings</h1>
        <p className="text-xs text-slate-500 mt-1">Monthly franchise revenue split & payout details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Current Rate</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">8.0%</div>
          <div className="text-[10px] text-slate-400 mt-1">Base Franchise Agreement</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Estimated Payout</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">₹38,800</div>
          <div className="text-[10px] text-slate-400 mt-1">For March 2026</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Last Settled</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹32,400</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Paid on Feb 28, 2026</div>
        </div>
      </div>
    </div>
  );
};

export default CommissionEarnings;