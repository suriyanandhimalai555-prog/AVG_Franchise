import React, { useState } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  CreditCard, 
  Wallet, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  UserPlus, 
  Percent, 
  CheckSquare, 
  Receipt, 
  Repeat, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';

const FranchiseDashboard = () => {
  const [transactions] = useState([
    { id: 'TXN-9081', customer: 'Rahul Sharma', amount: 4500, mode: 'Online (UPI)', status: 'Completed', date: 'Today, 02:30 PM' },
    { id: 'TXN-9082', customer: 'Anita Roy', amount: 12000, mode: 'Bank Transfer', status: 'Completed', date: 'Today, 01:15 PM' },
    { id: 'TXN-9083', customer: 'Vikram Singh', amount: 3200, mode: 'Cash', status: 'Completed', date: 'Today, 11:45 AM' },
    { id: 'TXN-9084', customer: 'Pooja Mehta', amount: 8500, mode: 'Online (Card)', status: 'Pending Verification', date: 'Today, 10:20 AM' },
  ]);

  const [pendingTasks] = useState([
    { id: 1, title: 'Submit Daily Closing Report', priority: 'High', due: 'Today, 07:00 PM' },
    { id: 2, title: 'Follow up on Pending Dues (₹12,400)', priority: 'Medium', due: 'Tomorrow' },
    { id: 3, title: 'Verify Bank Transfer TXN-9084', priority: 'High', due: 'Immediate' },
  ]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Franchise Branch Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time daily & monthly performance metrics for North Branch (FR-NORTH-01)</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5">
            <Receipt className="w-4 h-4" /> Add Daily Entry
          </button>
        </div>
      </div>

      {/* Primary Daily Metrics (Grid 1) */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Today's Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Today Sales" 
            value="₹28,200" 
            badge="+12.4%" 
            isPositive={true}
            sub="14 New orders placed" 
            icon={TrendingUp} 
            iconBg="bg-blue-50 text-blue-600 border-blue-100" 
          />
          <MetricCard 
            title="Today Collection" 
            value="₹24,500" 
            badge="86.8%" 
            isPositive={true}
            sub="Total collected today" 
            icon={IndianRupee} 
            iconBg="bg-emerald-50 text-emerald-600 border-emerald-100" 
          />
          <MetricCard 
            title="Today Expenses" 
            value="₹2,100" 
            badge="Low" 
            isPositive={true}
            sub="Petty cash & operational" 
            icon={Receipt} 
            iconBg="bg-amber-50 text-amber-600 border-amber-100" 
          />
          <MetricCard 
            title="Outstanding Dues" 
            value="₹12,400" 
            badge="Action Req." 
            isPositive={false}
            sub="Pending customer balances" 
            icon={AlertCircle} 
            iconBg="bg-rose-50 text-rose-600 border-rose-100" 
          />
        </div>
      </div>

      {/* Collection Breakdown Metrics (Grid 2) */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Modes Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard 
            title="Cash Collection" 
            value="₹5,200" 
            badge="21.2%" 
            isPositive={true}
            sub="In-hand cash" 
            icon={Wallet} 
            iconBg="bg-emerald-50 text-emerald-600 border-emerald-100" 
          />
          <MetricCard 
            title="Online Collection" 
            value="₹13,000" 
            badge="53.0%" 
            isPositive={true}
            sub="UPI & Card payments" 
            icon={CreditCard} 
            iconBg="bg-indigo-50 text-indigo-600 border-indigo-100" 
          />
          <MetricCard 
            title="Bank Transfer" 
            value="₹6,300" 
            badge="25.8%" 
            isPositive={true}
            sub="Direct NEFT/IMPS" 
            icon={Building2} 
            iconBg="bg-purple-50 text-purple-600 border-purple-100" 
          />
        </div>
      </div>

      {/* Monthly & Lead Performance Metrics (Grid 3) */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Performance & Business Growth</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Monthly Sales" 
            value="₹4,85,000" 
            badge="+18.5%" 
            isPositive={true}
            sub="Current Month Cumulative" 
            icon={Calendar} 
            iconBg="bg-blue-50 text-blue-600 border-blue-100" 
          />
          <MetricCard 
            title="Monthly Collection" 
            value="₹4,42,000" 
            badge="91.1%" 
            isPositive={true}
            sub="Collected this month" 
            icon={IndianRupee} 
            iconBg="bg-emerald-50 text-emerald-600 border-emerald-100" 
          />
          <MetricCard 
            title="Commission Earnings" 
            value="₹38,800" 
            badge="8% Rate" 
            isPositive={true}
            sub="Estimated payout" 
            icon={Percent} 
            iconBg="bg-teal-50 text-teal-600 border-teal-100" 
          />
          <MetricCard 
            title="Total Customers" 
            value="342 Active" 
            badge="+8 New" 
            isPositive={true}
            sub="Registered branch clients" 
            icon={Users} 
            iconBg="bg-sky-50 text-sky-600 border-sky-100" 
          />
        </div>
      </div>

      {/* Leads, Conversions & Pending Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leads & Conversion Rate Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leads & Conversions</h2>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              High Conversion
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-medium">New Leads</span>
              </div>
              <div className="text-xl font-bold text-slate-900">48</div>
              <div className="text-[10px] text-slate-400 mt-1">This Month</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Repeat className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-medium">Conversions</span>
              </div>
              <div className="text-xl font-bold text-slate-900">31</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">64.5% Rate</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span>Monthly Lead Target</span>
              <span>31 / 50 Converted</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending Tasks ({pendingTasks.length})</h2>
            </div>
            <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All Tasks</button>
          </div>

          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{task.title}</div>
                    <div className="text-[10px] text-slate-400">Due: {task.due}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  task.priority === 'High' 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Today Transactions</h2>
          <span className="text-[11px] font-semibold text-slate-500">Showing {transactions.length} Transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Transaction ID</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Payment Mode</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Date & Time</th>
                <th className="py-3.5 px-4 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">{txn.id}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{txn.customer}</td>
                  <td className="py-3.5 px-4 text-slate-600">{txn.mode}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{txn.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-400">{txn.date}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      txn.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {txn.status}
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

// Reusable MetricCard Component matching Super Admin style
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

export default FranchiseDashboard;