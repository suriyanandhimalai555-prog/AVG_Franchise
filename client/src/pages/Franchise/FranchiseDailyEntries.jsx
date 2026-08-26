import React, { useState } from 'react';
import { Plus, Search, Calendar, CheckCircle2, AlertCircle, IndianRupee } from 'lucide-react';

const DailyEntries = () => {
  const [entries, setEntries] = useState([
    { id: 'DE-201', date: '2026-03-30', sales: 28200, collection: 24500, expenses: 2100, status: 'Verified', note: 'Regular counter sales' },
    { id: 'DE-200', date: '2026-03-29', sales: 34500, collection: 31000, expenses: 1500, status: 'Verified', note: 'Bulk client order' },
    { id: 'DE-199', date: '2026-03-28', sales: 19800, collection: 19800, expenses: 800, status: 'Pending Verification', note: 'Weekend shift' },
  ]);

  const [formData, setFormData] = useState({ sales: '', collection: '', expenses: '', note: '' });

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!formData.sales || !formData.collection) return;
    const newEntry = {
      id: `DE-${entries.length + 201}`,
      date: new Date().toISOString().split('T')[0],
      sales: Number(formData.sales),
      collection: Number(formData.collection),
      expenses: Number(formData.expenses || 0),
      status: 'Pending Verification',
      note: formData.note || 'Daily summary',
    };
    setEntries([newEntry, ...entries]);
    setFormData({ sales: '', collection: '', expenses: '', note: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Sales & Entries</h1>
          <p className="text-xs text-slate-500 mt-1">Submit and track daily branch revenue logs</p>
        </div>
      </div>

      {/* Entry Input Form */}
      <form onSubmit={handleAddEntry} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">New Daily Entry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Sales (₹)</label>
            <input 
              type="number" 
              required
              placeholder="e.g. 25000" 
              value={formData.sales}
              onChange={(e) => setFormData({ ...formData, sales: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Collection (₹)</label>
            <input 
              type="number" 
              required
              placeholder="e.g. 22000" 
              value={formData.collection}
              onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expenses (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 1500" 
              value={formData.expenses}
              onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Remarks</label>
          <input 
            type="text" 
            placeholder="Add entry description or notes..." 
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Submit Entry
        </button>
      </form>

      {/* Entries Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Submitted Logs</h2>
          <span className="text-[11px] font-semibold text-slate-500">Total Logs: {entries.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Entry ID</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Sales</th>
                <th className="py-3.5 px-4 font-bold">Collection</th>
                <th className="py-3.5 px-4 font-bold">Expenses</th>
                <th className="py-3.5 px-4 font-bold">Notes</th>
                <th className="py-3.5 px-4 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{item.id}</td>
                  <td className="py-3.5 px-4">{item.date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{item.sales.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">₹{item.collection.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">₹{item.expenses.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.note}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'Verified' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {item.status}
                    </span>
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

export default DailyEntries;