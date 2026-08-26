import React from 'react';

const StateApprovals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">State Head Pending Approvals</h1>
        <p className="text-xs text-slate-500 mt-1">Approve new franchise signups, closures, and royalty overrides</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-xs text-slate-600 space-y-3">
        <div className="p-3 border border-slate-100 rounded-xl flex justify-between items-center">
          <div>
            <div className="font-bold text-slate-900">New Signup Approval - Madurai Zone</div>
            <div className="text-[10px] text-slate-400">Submitted by M. Karthik</div>
          </div>
          <button className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg">Approve Signup</button>
        </div>
      </div>
    </div>
  );
};

export default StateApprovals;