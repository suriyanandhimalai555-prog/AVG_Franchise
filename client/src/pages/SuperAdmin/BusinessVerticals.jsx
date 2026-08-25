import React from 'react';
import { Plus, Store, Truck, CreditCard, DollarSign, ArrowUpRight, ChevronRight, Settings } from 'lucide-react';

const BusinessVerticals = () => {
  const verticals = [
    { name: 'AVG Mart', icon: Store, count: 142, rev: '₹4.2 Cr', growth: '+14%', color: 'from-blue-600 to-indigo-600', status: 'Operational' },
    { name: 'AVG Courier', icon: Truck, count: 210, rev: '₹2.8 Cr', growth: '+8%', color: 'from-emerald-600 to-teal-600', status: 'Operational' },
    { name: 'AVG Pay', icon: CreditCard, count: 320, rev: '₹1.9 Cr', growth: '+22%', color: 'from-amber-500 to-orange-600', status: 'Scaling' },
    { name: 'AVG Forex', icon: DollarSign, count: 65, rev: '₹3.1 Cr', growth: '+5%', color: 'from-violet-600 to-purple-600', status: 'Operational' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Verticals</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active business domains, units, and localized offerings</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-4 h-4" /> Add Vertical
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {verticals.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.name} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${v.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{v.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                  {v.status}
                </span>

                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Franchises</span>
                    <span className="font-bold text-slate-800">{v.count} Units</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Monthly Vol.</span>
                    <span className="font-bold text-emerald-600">{v.rev}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Manage Vertical</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessVerticals;