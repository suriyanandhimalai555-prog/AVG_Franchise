import React from 'react';
import { Percent, Plus, Edit2, ShieldCheck } from 'lucide-react';

const CommissionSettings = () => {
  const rules = [
    { vertical: 'AVG Mart', model: 'Percentage Slab', value: '4.5%', applyTo: 'Store Sales Volume', updated: '2 days ago' },
    { vertical: 'AVG Courier', model: 'Fixed Per Parcel', value: '₹12.00 / pkg', applyTo: 'Dispatched Units', updated: '1 week ago' },
    { vertical: 'AVG Pay', model: 'Tiered Split', value: '0.20% - 0.85%', applyTo: 'Transaction Volume', updated: 'Yesterday' },
    { vertical: 'AVG Forex', model: 'Percentage Margin', value: '1.2%', applyTo: 'Currency Conversion', updated: '3 weeks ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Commission Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Define percentage and fixed revenue-sharing rules for all verticals</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-4 h-4" /> New Commission Rule
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3.5 px-5">Vertical Target</th>
                <th className="py-3.5 px-5">Payout Model</th>
                <th className="py-3.5 px-5">Commission Rate</th>
                <th className="py-3.5 px-5">Applied Condition</th>
                <th className="py-3.5 px-5">Last Modified</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {rules.map((r) => (
                <tr key={r.vertical} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-800">{r.vertical}</td>
                  <td className="py-4 px-5 text-slate-600">{r.model}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md text-[11px] font-bold">
                      <Percent className="w-3 h-3 text-emerald-500" /> {r.value}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-500">{r.applyTo}</td>
                  <td className="py-4 px-5 text-slate-400 text-[11px]">{r.updated}</td>
                  <td className="py-4 px-5 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettings;