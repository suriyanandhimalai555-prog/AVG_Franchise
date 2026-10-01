// src/pages/Stockholder/StockholderDashboard.jsx
import React from 'react';
import { TrendingUp, PieChart, DollarSign, Award, ArrowUpRight, FileText, Download, Shield } from 'lucide-react';

const StockholderDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const financialMetrics = [
    { label: 'Total Portfolio Value', value: '₹48,50,000', change: '+14.2%', isPos: true, icon: DollarSign },
    { label: 'Total Equity Share', value: '2.50%', change: 'Fixed Pool', isPos: true, icon: PieChart },
    { label: 'YTD Dividend Payout', value: '₹3,20,000', change: '+8.5%', isPos: true, icon: TrendingUp },
    { label: 'Quarterly ROI', value: '18.4%', change: '+2.1%', isPos: true, icon: Award },
  ];

  const quarterlyReports = [
    { title: 'Q2 2026 Financial Earnings Report', date: 'Jul 15, 2026', size: '2.4 MB' },
    { title: 'Q1 2026 Dividend Distribution Audit', date: 'Apr 10, 2026', size: '1.8 MB' },
    { title: 'Annual Fiscal Statement 2025-26', date: 'Mar 31, 2026', size: '4.2 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
            Shareholder Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Welcome, {user.name || 'Valued Investor'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Real-time equity breakdown, financial performance telemetry, dividend logs, and official corporate reports.
          </p>
        </div>
        <PieChart className="absolute -right-8 -bottom-8 w-64 h-64 text-slate-800/60 pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.label}</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{m.value}</div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{m.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dividend Distribution History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Dividend Distributions</h2>
              <p className="text-xs text-slate-500">History of profit payouts credited to your registered account</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Payout Period</th>
                  <th className="py-3 px-4">Yield Per Share</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-slate-800">Q2 2026 Dividend</td>
                  <td className="py-3.5 px-4 text-slate-600">₹45.00</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹1,12,500</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Settled
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-slate-800">Q1 2026 Dividend</td>
                  <td className="py-3.5 px-4 text-slate-600">₹42.50</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹1,06,250</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Settled
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-slate-800">Q4 2025 Dividend</td>
                  <td className="py-3.5 px-4 text-slate-600">₹40.00</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹1,00,000</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Settled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Financial Reports */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Investor Documents</h2>
            <p className="text-xs text-slate-500 mb-4">Official quarterly and annual financial filings</p>

            <div className="space-y-3">
              {quarterlyReports.map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{r.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{r.date} &bull; {r.size}</div>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Audited by AVG Board of Directors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockholderDashboard;