import React from 'react';
import { CheckSquare, Check, X, Clock, UserCheck } from 'lucide-react';

const ApprovalWorkflows = () => {
  const pending = [
    { id: 'APP-102', type: 'Franchise Signup', requester: 'Kiran Reddy (Karnataka)', details: 'New AVG Mart Outlet Request', date: '10 mins ago' },
    { id: 'APP-103', type: 'Commission Exemption', requester: 'Priya Nair (Kerala)', details: '0.5% Discount Split for Courier Unit', date: '1 hour ago' },
    { id: 'APP-104', type: 'Territory Reallocation', requester: 'Amit Verma (Maharashtra)', details: 'Shift Pune District boundaries', date: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approvals Queue</h1>
          <p className="text-xs text-slate-500 mt-1">Process stage adjustments, new franchise entries, and policy exceptions</p>
        </div>
      </div>

      <div className="space-y-3">
        {pending.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{p.type}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.id}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{p.details}</p>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">Requested by <span className="text-slate-600 font-semibold">{p.requester}</span> • {p.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors">
                <X className="w-3.5 h-3.5" /> Reject
              </button>
              <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md shadow-blue-500/20 transition-all">
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalWorkflows;