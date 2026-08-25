import React, { useState } from 'react';
import { 
  Users, Search, Award, TrendingUp, CheckCircle, 
  Target, Mail, Phone, ArrowUpRight 
} from 'lucide-react';

const salesManagersData = [
  { id: 'SM-01', name: 'S. Kumar', zone: 'Tamil Nadu - Zone 1 (Chennai)', outlets: 40, activeOutlets: 40, monthlyTarget: '₹50.00 L', actualCollection: '₹52.00 L', targetPct: 104.0, newPipeline: 5, status: 'Top Performer' },
  { id: 'SM-02', name: 'V. Anand', zone: 'Tamil Nadu - Zone 2 (Tambaram)', outlets: 42, activeOutlets: 40, monthlyTarget: '₹50.00 L', actualCollection: '₹48.00 L', targetPct: 96.0, newPipeline: 3, status: 'On Track' },
  { id: 'SM-03', name: 'P. Murugan', zone: 'Tamil Nadu - Zone 3 (Coimbatore)', outlets: 38, activeOutlets: 38, monthlyTarget: '₹45.00 L', actualCollection: '₹46.50 L', targetPct: 103.3, newPipeline: 4, status: 'Top Performer' },
  { id: 'SM-04', name: 'N. Hegde', zone: 'Karnataka - Zone 1 (Bengaluru)', outlets: 50, activeOutlets: 48, monthlyTarget: '₹60.00 L', actualCollection: '₹64.20 L', targetPct: 107.0, newPipeline: 8, status: 'Top Performer' },
  { id: 'SM-05', name: 'P. Nair', zone: 'Kerala - Zone 1 (Ernakulam)', outlets: 35, activeOutlets: 34, monthlyTarget: '₹38.00 L', actualCollection: '₹39.00 L', targetPct: 102.6, newPipeline: 2, status: 'On Track' },
  { id: 'SM-06', name: 'V. Naidu', zone: 'Andhra Pradesh - Zone 1 (Vizag)', outlets: 32, activeOutlets: 28, monthlyTarget: '₹35.00 L', actualCollection: '₹28.50 L', targetPct: 81.4, newPipeline: 1, status: 'Needs Support' },
];

const DirectorManagers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredManagers = salesManagersData.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Managers Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">Field manager operational target adherence, franchise supervision, and collections</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-72 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search manager name, zone, ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
          />
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Active Field Managers</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">34 Managers</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">100% Territory Coverage</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Manager Collection Target</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">102.4%</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">28 Managers Above Target</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Pipeline Leads</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">84 Leads</span>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Avg 2.5 Leads per Manager</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Managers Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Manager Performance Ledger</h2>
          <span className="text-[11px] text-slate-400 font-medium">Monthly evaluation cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Manager Name & ID</th>
                <th className="py-3.5 px-4 font-bold">Assigned Zone</th>
                <th className="py-3.5 px-4 font-bold">Outlets Supervised</th>
                <th className="py-3.5 px-4 font-bold">Target</th>
                <th className="py-3.5 px-4 font-bold">Collection</th>
                <th className="py-3.5 px-4 font-bold">Target %</th>
                <th className="py-3.5 px-4 font-bold">Leads Pipeline</th>
                <th className="py-3.5 px-4 text-right font-bold">Rating Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredManagers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-xs">
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div>{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.id}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{m.zone}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{m.activeOutlets}</span>
                    <span className="text-slate-400 text-[10px]"> / {m.outlets} units</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{m.monthlyTarget}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{m.actualCollection}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${m.targetPct >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {m.targetPct}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-600">{m.newPipeline} New Leads</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      m.status === 'Top Performer' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : m.status === 'On Track' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-rose-50 text-rose-600 border-rose-200'
                    }`}>
                      {m.status}
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

export default DirectorManagers;