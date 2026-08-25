import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const CoordinatorApprovals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Approvals & Escalations</h1>
        <p className="text-xs text-slate-500 mt-1">Cross-state special overrides, high-value signups, and escalations</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-xs text-slate-600 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="font-bold text-slate-900">Andhra Pradesh Royalty Waiver Request</div>
            <div className="text-[10px] text-slate-400">Requested by State Head K. Reddy • ID: APP-902</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">Approve</button>
            <button className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-[10px]">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorApprovals;