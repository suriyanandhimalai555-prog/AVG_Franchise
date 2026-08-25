import React from 'react';
import { CheckCircle2, ChevronRight, Clock, AlertCircle } from 'lucide-react';

const UserDashboard = () => {
  const steps = [
    { title: 'Today Opening', completed: true },
    { title: 'Sales Entry', completed: true },
    { title: 'Collection Entry', completed: true },
    { title: 'Customer Entry', current: true },
    { title: 'Expense Entry', completed: false },
    { title: 'Closing Entry', completed: false },
    { title: 'Submit Report', completed: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Bar */}
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">AVG</div>
            <span className="font-bold text-sm">Franchise Daily Workflow</span>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">Branch #125</span>
        </header>

        {/* Workflow Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Daily Steps Track</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex flex-col items-center text-center text-xs ${
                  step.completed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
                  step.current ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold ring-2 ring-blue-400/20' : 
                  'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className="w-5 h-5 mb-1 rounded-full flex items-center justify-center text-[10px] bg-white border font-bold">
                  {step.completed ? '✓' : idx + 1}
                </span>
                <span className="leading-tight">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auto Calculated Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Auto Calculated Summary</h2>
            <span className="text-xs text-slate-500">22 May 2025</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryBox title="Total Sales" value="₹ 1,28,450" color="blue" />
            <SummaryBox title="Total Collection" value="₹ 1,05,300" color="emerald" />
            <SummaryBox title="Cash" value="₹ 32,450" color="amber" />
            <SummaryBox title="Expenses" value="₹ 12,480" color="rose" />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Today's Activity Log</h2>
          <div className="space-y-3">
            <ActivityRow title="Sales Entered" detail="Total sales of ₹ 1,28,450 entered" time="11:30 AM" />
            <ActivityRow title="Collection Updated" detail="Collection of ₹ 1,05,300 recorded" time="01:15 PM" />
            <ActivityRow title="Expenses Submitted" detail="Expenses of ₹ 12,480 submitted" time="03:45 PM" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryBox = ({ title, value, color }) => (
  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
    <span className="text-xs text-slate-500">{title}</span>
    <div className="text-lg font-bold text-slate-800 mt-1">{value}</div>
  </div>
);

const ActivityRow = ({ title, detail, time }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-slate-500">{detail}</p>
      </div>
    </div>
    <span className="text-slate-400 font-mono text-[11px]">{time}</span>
  </div>
);

export default UserDashboard;