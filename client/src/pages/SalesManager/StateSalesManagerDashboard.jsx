import React, { useState } from 'react';
import { 
  Store, 
  AlertCircle, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckSquare, 
  PhoneCall, 
  MapPin, 
  UserPlus, 
  CheckCircle2 
} from 'lucide-react';

const StateSalesManagerDashboard = () => {
  const [assignedFranchises] = useState([
    { id: 'FR-101', name: 'North Franchise Store A', location: 'District 1', active: true, reportSubmitted: true, sales: 45000, collection: 40000, outstanding: 5000, performance: 'Good' },
    { id: 'FR-102', name: 'Central Retail Outlet', location: 'District 1', active: true, reportSubmitted: false, sales: 0, collection: 0, outstanding: 28000, performance: 'Low' },
    { id: 'FR-103', name: 'East Side Station', location: 'District 2', active: true, reportSubmitted: true, sales: 32000, collection: 32000, outstanding: 0, performance: 'Good' },
    { id: 'FR-104', name: 'West End Hub', location: 'District 2', active: false, reportSubmitted: false, sales: 0, collection: 0, outstanding: 12000, performance: 'Low' },
  ]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">State Sales Manager Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Managing assigned territory & daily franchise operations</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row (Matching SuperAdmin MetricCard Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="My Franchises" 
          value="4 Stores" 
          badge="+12.5%" 
          isPositive={true}
          sub="3 Active stores operating" 
          icon={Store} 
          iconBg="bg-blue-50 text-blue-600 border-blue-100" 
        />
        <MetricCard 
          title="Pending Daily Reports" 
          value="2 Outlets" 
          badge="Action Req." 
          isPositive={false}
          sub="Daily logs not submitted" 
          icon={AlertCircle} 
          iconBg="bg-rose-50 text-rose-600 border-rose-100" 
        />
        <MetricCard 
          title="Today's Sales" 
          value="₹77,000" 
          badge="+8.2%" 
          isPositive={true}
          sub="Target Ach. 82%" 
          icon={TrendingUp} 
          iconBg="bg-emerald-50 text-emerald-600 border-emerald-100" 
        />
        <MetricCard 
          title="Today's Collection" 
          value="₹72,000" 
          badge="88% Eff." 
          isPositive={true}
          sub="₹45,000 total outstanding" 
          icon={IndianRupee} 
          iconBg="bg-indigo-50 text-indigo-600 border-indigo-100" 
        />
      </div>

      {/* Quick Action Grid */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold text-slate-800">Main Activities</h2>
          <span className="text-xs text-slate-400 font-medium">Manager Actions</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/30 transition-all text-center group">
            <CheckSquare className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-700">Daily Verification</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/30 transition-all text-center group">
            <PhoneCall className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-700">Collection Follow-up</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/30 transition-all text-center group">
            <MapPin className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-700">Franchise Visit</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/30 transition-all text-center group">
            <UserPlus className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-700">Franchise Leads</span>
          </button>
        </div>
      </div>

      {/* Territory Stores Live Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Assigned Outlets Overview</h2>
          <span className="text-[11px] font-semibold text-slate-500">Showing {assignedFranchises.length} Stores</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Outlet Details</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold">Daily Report Status</th>
                <th className="py-3.5 px-4 font-bold">Today Sales</th>
                <th className="py-3.5 px-4 font-bold">Outstanding</th>
                <th className="py-3.5 px-4 text-center font-bold">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assignedFranchises.map((fr) => (
                <tr key={fr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{fr.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{fr.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{fr.location}</td>
                  <td className="py-3.5 px-4">
                    {!fr.reportSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                        🔴 Daily Report Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Submitted
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{fr.sales.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">₹{fr.outstanding.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      fr.performance === 'Good' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {fr.performance}
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

// MetricCard exact replica of SuperAdmin Dashboard
const MetricCard = ({ title, value, badge, isPositive, sub, icon: Icon, iconBg }) => (
  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl border ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {badge}
      </span>
    </div>
    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</div>
    <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</div>
    <div className="text-[11px] text-slate-400 mt-2 font-medium">{sub}</div>
  </div>
);

export default StateSalesManagerDashboard;