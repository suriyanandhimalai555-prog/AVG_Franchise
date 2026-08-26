import React, { useState } from 'react';
import { 
  BarChart3, Users, Award, Wallet, Clock, 
  AlertTriangle, Layers, Building2, ShieldAlert 
} from 'lucide-react';

const StateReports = () => {
  const [activeTab, setActiveTab] = useState("district");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">State Operational Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Deep-dive performance telemetry for districts, managers, collections, and closures</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'district', label: 'District Performance' },
          { id: 'manager', label: 'Sales Manager Performance' },
          { id: 'ranking', label: 'Franchise Ranking' },
          { id: 'collection', label: 'Collection Efficiency' },
          { id: 'pipeline', label: 'New Opening Pipeline' },
          { id: 'outstanding', label: 'Outstanding Report' },
          { id: 'closing', label: 'Closing Report' },
          { id: 'vertical', label: 'Business Vertical Breakdown' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Body */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[350px]">
        {activeTab === 'district' && <DistrictReportView />}
        {activeTab === 'manager' && <ManagerReportView />}
        {activeTab === 'ranking' && <FranchiseRankingView />}
        {activeTab === 'collection' && <CollectionReportView />}
        {activeTab === 'pipeline' && <PipelineReportView />}
        {activeTab === 'outstanding' && <OutstandingReportView />}
        {activeTab === 'closing' && <ClosingReportView />}
        {activeTab === 'vertical' && <VerticalReportView />}
      </div>
    </div>
  );
};

/* Individual Report Views */

const DistrictReportView = () => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">District Performance Analytics</h3>
    <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
        <tr>
          <th className="p-3">District Name</th>
          <th className="p-3">Total Franchises</th>
          <th className="p-3">Monthly Sales</th>
          <th className="p-3">Collection %</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <tr><td className="p-3 font-bold text-slate-900">Chennai Urban</td><td className="p-3">120 Units</td><td className="p-3 font-bold text-blue-600">₹1.80 Cr</td><td className="p-3 font-bold text-emerald-600">96.5%</td></tr>
        <tr><td className="p-3 font-bold text-slate-900">Coimbatore Metro</td><td className="p-3">85 Units</td><td className="p-3 font-bold text-blue-600">₹1.10 Cr</td><td className="p-3 font-bold text-emerald-600">95.0%</td></tr>
      </tbody>
    </table>
  </div>
);

const ManagerReportView = () => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sales Manager Performance</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
        <div className="font-bold text-slate-900">V. Anand (Chennai District)</div>
        <div className="text-[11px] text-slate-500">Supervising 120 Franchises • Target: 108% Met</div>
      </div>
    </div>
  </div>
);

const FranchiseRankingView = () => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Performing Franchises</h3>
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
      <span className="font-bold text-slate-900">#1 AVG Superstore Anna Nagar</span>
      <span className="text-emerald-600 font-bold">₹12.4 L Sales</span>
    </div>
  </div>
);

const CollectionReportView = () => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Collection Efficiency Matrix</h3>
    <p className="text-xs text-slate-500">Overall State Collection Efficiency is sitting at <strong className="text-emerald-600">95.2%</strong> for the current billing cycle.</p>
  </div>
);

const PipelineReportView = () => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Store Openings Pipeline</h3>
    <div className="p-3 border border-slate-200 rounded-xl text-xs flex justify-between">
      <span>AVG Express Velachery (Chennai)</span>
      <span className="text-blue-600 font-bold">Opening Sep 1, 2026</span>
    </div>
  </div>
);

const OutstandingReportView = () => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Outstanding Recovery Ledger</h3>
    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
      Total Outstanding Balance: ₹18.50 L across 14 franchises.
    </div>
  </div>
);

const ClosingReportView = () => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">State Store Closure Log</h3>
    <div className="text-xs text-slate-600">
      • 18 Outlets Temporary Closed (Under Audit / Renovation)<br/>
      • 7 Outlets Permanently Closed (Contractual Termination)
    </div>
  </div>
);

const VerticalReportView = () => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Business Vertical Performance</h3>
    <div className="grid grid-cols-3 gap-3 text-xs">
      <div className="p-3 border rounded-xl bg-slate-50"><strong>Retail Hubs:</strong> ₹2.80 Cr</div>
      <div className="p-3 border rounded-xl bg-slate-50"><strong>Express Outlets:</strong> ₹1.10 Cr</div>
      <div className="p-3 border rounded-xl bg-slate-50"><strong>Hypermarkets:</strong> ₹0.30 Cr</div>
    </div>
  </div>
);

export default StateReports;