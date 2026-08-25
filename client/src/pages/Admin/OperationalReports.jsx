import React from 'react';
import { CheckSquare, FileText, Download } from 'lucide-react';

export const OperationalApprovals = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Operational Approval Workflows</h1>
      <p className="text-xs text-slate-500">Review pending franchisee opening/closing requests and target updates</p>
    </div>
    <div className="bg-white border p-6 rounded-2xl text-xs font-semibold text-slate-500">
      No critical pending system approvals requiring Admin intervention today.
    </div>
  </div>
);

export const OperationalReports = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports Management & Export Center</h1>
        <p className="text-xs text-slate-500">Export financial ledgers, sales forecasts, and compliance audit logs</p>
      </div>
      <button className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
        <Download className="w-4 h-4" /> Export All Reports (PDF/Excel)
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['Daily Sales Ledger', 'Outstanding Collection Ageing', 'Franchise Performance Matrix'].map(r => (
        <div key={r} className="bg-white border p-5 rounded-2xl shadow-sm space-y-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">{r}</h3>
          <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">Download PDF</button>
        </div>
      ))}
    </div>
  </div>
);