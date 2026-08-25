import React from 'react';
import { FileSpreadsheet, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

const DailyEntries = () => {
  const entries = [
    { id: 'DE-991', franchise: 'AVG Mart Indiranagar', sales: '₹45,000', collection: '₹42,000', expenses: '₹3,000', status: 'Submitted' },
    { id: 'DE-992', franchise: 'AVG Courier Aluva', sales: '₹28,000', collection: '₹28,000', expenses: '₹1,200', status: 'Verified' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Daily Report Entries & Verification Queue</h1>
        <p className="text-xs text-slate-500">Audit sales, collection breakdown, and approve daily store closings</p>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50">
              <th className="p-4">Report ID & Store</th>
              <th className="p-4">Total Sales</th>
              <th className="p-4">Net Collection</th>
              <th className="p-4">Reported Expenses</th>
              <th className="p-4">Verification Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map(e => (
              <tr key={e.id} className="hover:bg-slate-50/80">
                <td className="p-4 font-bold text-slate-800">
                  {e.franchise}
                  <div className="text-[10px] font-mono font-normal text-slate-400">{e.id}</div>
                </td>
                <td className="p-4 font-bold text-slate-800">{e.sales}</td>
                <td className="p-4 font-bold text-emerald-600">{e.collection}</td>
                <td className="p-4 text-rose-600">{e.expenses}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    e.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {e.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {e.status === 'Submitted' ? (
                    <div className="flex gap-1 justify-end">
                      <button className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-lg">Approve</button>
                      <button className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-[10px] rounded-lg">Return</button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Locked & Verified</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyEntries;