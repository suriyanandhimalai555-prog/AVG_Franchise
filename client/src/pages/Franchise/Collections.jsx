import React, { useState } from 'react';
import { IndianRupee, Wallet, CreditCard, Building2, AlertCircle } from 'lucide-react';

const Collections = () => {
  const [dues] = useState([
    { id: 'CUST-101', customer: 'Rahul Sharma', amount: 4500, dueDate: '2026-04-02', status: 'Pending' },
    { id: 'CUST-104', customer: 'Pooja Mehta', amount: 7900, dueDate: '2026-03-31', status: 'Overdue' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Collections & Dues</h1>
        <p className="text-xs text-slate-500 mt-1">Track payments breakdown and customer outstanding balances</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Cash In Hand</div>
              <div className="text-xl font-bold text-slate-900">₹5,200</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Digital / UPI</div>
              <div className="text-xl font-bold text-slate-900">₹13,000</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Total Outstanding Dues</div>
              <div className="text-xl font-bold text-rose-600">₹12,400</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending Customer Balances</h2>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4 font-bold">Customer ID</th>
              <th className="py-3.5 px-4 font-bold">Customer Name</th>
              <th className="py-3.5 px-4 font-bold">Outstanding Amount</th>
              <th className="py-3.5 px-4 font-bold">Due Date</th>
              <th className="py-3.5 px-4 text-center font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {dues.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{d.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">{d.customer}</td>
                <td className="py-3.5 px-4 font-bold text-rose-600">₹{d.amount.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-slate-500">{d.dueDate}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    d.status === 'Overdue' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Collections;