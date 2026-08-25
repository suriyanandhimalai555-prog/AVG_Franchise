import React from 'react';
import { 
  Store, AlertTriangle, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, UserCheck, CheckCircle2 
} from 'lucide-react';

const AdminDashboard = () => {
  const kpis = [
    { title: "Total Franchises", value: "1,248", change: "+12%", icon: Store, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Today's Collection", value: "₹42,85,000", change: "+8.4%", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pending Reports Alert", value: "18 Franchises", alert: true, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Total Outstanding", value: "₹18,40,200", change: "-2.1%", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const pendingReports = [
    { id: 'AVG-TN-CHN-00125', name: 'AVG Mart Indiranagar', manager: 'Suresh Raina', territory: 'Karnataka / Bangalore', phone: '+91 9876543210' },
    { id: 'AVG-KL-EKM-00042', name: 'AVG Courier Aluva', manager: 'Anil Kumar', territory: 'Kerala / Ernakulam', phone: '+91 9876543211' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Operational Admin Dashboard</h1>
        <p className="text-xs text-slate-500">Real-time daily reporting metrics, collection efficiency, and urgent alerts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
              {kpi.change && (
                <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {kpi.change} vs last month
                </div>
              )}
              {kpi.alert && (
                <div className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                  🔴 Daily Report Pending
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pending Daily Reports Queue */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">Franchises with Pending Daily Reports</h3>
          </div>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-200">Action Required</span>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingReports.map((item) => (
            <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600">{item.id}</span>
                  <span className="text-xs font-bold text-slate-800">• {item.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Assigned Manager: {item.manager} | {item.territory}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors">
                  Send Reminder Notification
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;