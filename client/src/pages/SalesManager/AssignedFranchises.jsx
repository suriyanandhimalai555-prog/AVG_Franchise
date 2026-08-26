import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Eye, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

const mockAssignedFranchises = [
  {
    id: 'FR-101',
    name: 'North Franchise Store A',
    owner: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    location: 'District 1 - North Zone',
    status: 'Active',
    reportSubmitted: true,
    todaySales: 45000,
    todayCollection: 40000,
    outstanding: 5000,
    performance: 'Good',
    healthScore: '94%',
  },
  {
    id: 'FR-102',
    name: 'Central Retail Outlet',
    owner: 'Suresh Patel',
    phone: '+91 98765 43211',
    location: 'District 1 - Central Zone',
    status: 'Active',
    reportSubmitted: false, // Triggers Red Warning
    todaySales: 0,
    todayCollection: 0,
    outstanding: 28000,
    performance: 'Low',
    healthScore: '58%',
  },
  {
    id: 'FR-103',
    name: 'East Side Station',
    owner: 'Anita Singh',
    phone: '+91 98765 43212',
    location: 'District 2 - East Zone',
    status: 'Active',
    reportSubmitted: true,
    todaySales: 32000,
    todayCollection: 32000,
    outstanding: 0,
    performance: 'Good',
    healthScore: '98%',
  },
  {
    id: 'FR-104',
    name: 'West End Hub',
    owner: 'Vikram Verma',
    phone: '+91 98765 43213',
    location: 'District 2 - West Zone',
    status: 'Inactive',
    reportSubmitted: false, // Triggers Red Warning
    todaySales: 0,
    todayCollection: 0,
    outstanding: 12000,
    performance: 'Low',
    healthScore: '40%',
  },
];

const AssignedFranchises = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredFranchises = mockAssignedFranchises.filter((fr) => {
    const matchesSearch = 
      fr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fr.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'PendingReport') return matchesSearch && !fr.reportSubmitted;
    if (filterStatus === 'LowPerformance') return matchesSearch && fr.performance === 'Low';
    if (filterStatus === 'Active') return matchesSearch && fr.status === 'Active';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Assigned Franchises</h1>
          <p className="text-xs text-slate-500 mt-1">
            Managing {mockAssignedFranchises.length} outlets in your assigned sales territory
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs w-full sm:w-80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search outlet name, ID, or owner..."
            className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'All Franchises' },
            { id: 'PendingReport', label: '🔴 Pending Reports' },
            { id: 'LowPerformance', label: 'Low Performing' },
            { id: 'Active', label: 'Active Stores' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                filterStatus === btn.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Franchise List Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Franchise & Owner</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold">Daily Report Status</th>
                <th className="py-3.5 px-4 font-bold">Today Sales</th>
                <th className="py-3.5 px-4 font-bold">Outstanding</th>
                <th className="py-3.5 px-4 font-bold">Performance</th>
                <th className="py-3.5 px-4 text-center font-bold">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFranchises.map((fr) => (
                <tr key={fr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{fr.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{fr.id} • {fr.owner}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{fr.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {!fr.reportSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 shadow-sm animate-pulse">
                        🔴 Daily Report Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Submitted
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹{fr.todaySales.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">
                    ₹{fr.outstanding.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      fr.performance === 'Good' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {fr.performance === 'Good' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {fr.performance} ({fr.healthScore})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`tel:${fr.phone}`}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors border border-slate-200"
                        title="Call Franchise Owner"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold transition-colors">
                        Inspect
                      </button>
                    </div>
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

export default AssignedFranchises;