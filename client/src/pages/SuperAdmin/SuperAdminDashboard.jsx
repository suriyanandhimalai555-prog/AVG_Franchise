import React from 'react';
import { Building2, IndianRupee, UserCheck, ShieldAlert, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Metrics Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time status across all active vertical operations</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Franchises" 
          value="4,782" 
          badge="+12.5%" 
          isPositive={true}
          sub="34 pending signups" 
          icon={Building2} 
          iconBg="bg-blue-50 text-blue-600 border-blue-100" 
        />
        <MetricCard 
          title="Active State Heads" 
          value="28" 
          badge="100% Active" 
          isPositive={true}
          sub="Full coverage statewise" 
          icon={UserCheck} 
          iconBg="bg-emerald-50 text-emerald-600 border-emerald-100" 
        />
        <MetricCard 
          title="Total Revenue" 
          value="₹12.45 Cr" 
          badge="+8.2%" 
          isPositive={true}
          sub="₹1.28 Cr accumulated today" 
          icon={IndianRupee} 
          iconBg="bg-indigo-50 text-indigo-600 border-indigo-100" 
        />
        <MetricCard 
          title="Flagged Alerts" 
          value="14 Issues" 
          badge="-2.1%" 
          isPositive={false}
          sub="Action required on 3 items" 
          icon={ShieldAlert} 
          iconBg="bg-rose-50 text-rose-600 border-rose-100" 
        />
      </div>

      {/* Card Content Block */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Recent Franchise Onboardings</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Real-time update</span>
        </div>
        <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          Main activity metrics streaming live into analytics table.
        </div>
      </div>
    </div>
  );
};

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

export default SuperAdminDashboard;