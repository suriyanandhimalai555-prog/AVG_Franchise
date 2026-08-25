import React from 'react';

const StateComparison = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">State Comparison Matrix</h1>
        <p className="text-xs text-slate-500 mt-1">Cross-state benchmarking for sales, collections, and growth pace</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4 font-bold">Metric / Indicator</th>
              <th className="py-3.5 px-4 font-bold">Tamil Nadu</th>
              <th className="py-3.5 px-4 font-bold">Karnataka</th>
              <th className="py-3.5 px-4 font-bold">Kerala</th>
              <th className="py-3.5 px-4 font-bold">Andhra Pradesh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="py-3 px-4 font-bold text-slate-900">Total Revenue</td>
              <td className="py-3 px-4 text-emerald-600 font-bold">₹4.20 Cr</td>
              <td className="py-3 px-4 text-emerald-600 font-bold">₹3.80 Cr</td>
              <td className="py-3 px-4 text-emerald-600 font-bold">₹2.10 Cr</td>
              <td className="py-3 px-4 text-amber-600 font-bold">₹1.35 Cr</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-slate-900">Collection Efficiency</td>
              <td className="py-3 px-4 font-semibold">95.2%</td>
              <td className="py-3 px-4 font-semibold">94.7%</td>
              <td className="py-3 px-4 font-semibold">95.2%</td>
              <td className="py-3 px-4 font-semibold text-rose-600">88.8%</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-slate-900">New Signups</td>
              <td className="py-3 px-4 font-bold">18 Units</td>
              <td className="py-3 px-4 font-bold">15 Units</td>
              <td className="py-3 px-4 font-bold">8 Units</td>
              <td className="py-3 px-4 font-bold">4 Units</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateComparison;