import React, { useState } from 'react';
import { 
  Store, Search, Filter, CheckCircle2, XCircle, Clock, 
  AlertTriangle, ArrowUpRight, ShieldCheck, IndianRupee 
} from 'lucide-react';

const franchiseNetworkData = [
  { id: 'AVG-TN-001', name: 'AVG Mart - T.Nagar', state: 'Tamil Nadu', district: 'Chennai', manager: 'S. Kumar', businessType: 'Supermarket / Retail', status: 'Active', monthlySales: '₹14.50 L', monthlyCollection: '₹14.00 L', complianceScore: '98%' },
  { id: 'AVG-TN-002', name: 'AVG Pay - Velachery', state: 'Tamil Nadu', district: 'Chennai', manager: 'S. Kumar', businessType: 'Fintech / Kiosk', status: 'Active', monthlySales: '₹11.20 L', monthlyCollection: '₹11.00 L', complianceScore: '95%' },
  { id: 'AVG-KA-012', name: 'AVG Express - Indiranagar', state: 'Karnataka', district: 'Bengaluru Urban', manager: 'N. Hegde', businessType: 'Logistics / Courier', status: 'Active', monthlySales: '₹18.40 L', monthlyCollection: '₹18.10 L', complianceScore: '99%' },
  { id: 'AVG-KA-015', name: 'AVG Mart - Koramangala', state: 'Karnataka', district: 'Bengaluru Urban', manager: 'N. Hegde', businessType: 'Supermarket / Retail', status: 'Active', monthlySales: '₹22.00 L', monthlyCollection: '₹21.50 L', complianceScore: '97%' },
  { id: 'AVG-KL-008', name: 'AVG Fresh - Edappally', state: 'Kerala', district: 'Ernakulam', manager: 'P. Nair', businessType: 'Agri Fresh / Grocery', status: 'Active', monthlySales: '₹9.80 L', monthlyCollection: '₹9.50 L', complianceScore: '92%' },
  { id: 'AVG-AP-004', name: 'AVG Services - Vizag Port', state: 'Andhra Pradesh', district: 'Visakhapatnam', manager: 'V. Naidu', businessType: 'Service Kiosk', status: 'Inactive', monthlySales: '₹0.00 L', monthlyCollection: '₹0.00 L', complianceScore: '60%' },
  { id: 'AVG-TS-011', name: 'AVG Mart - Banjara Hills', state: 'Telangana', district: 'Hyderabad', manager: 'G. Krishna', businessType: 'Supermarket / Retail', status: 'Pending Setup', monthlySales: '₹0.00 L', monthlyCollection: '₹0.00 L', complianceScore: 'N/A' },
  { id: 'AVG-TN-045', name: 'AVG Pay - Tambaram', state: 'Tamil Nadu', district: 'Chennai', manager: 'V. Anand', businessType: 'Fintech / Kiosk', status: 'Notice Period', monthlySales: '₹3.20 L', monthlyCollection: '₹2.80 L', complianceScore: '78%' },
];

const DirectorFranchises = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredFranchises = franchiseNetworkData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Franchise Network Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Live operational and financial telemetry across 1,420 franchise outlets</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-64 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search outlet name, ID, manager..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl shadow-sm outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending Setup">Pending Setup</option>
            <option value="Notice Period">Notice Period</option>
          </select>
        </div>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusBadgeCard title="Total Franchises" count="1,420 Units" badge="Registered" color="blue" icon={Store} />
        <StatusBadgeCard title="Active Franchises" count="1,380 Units" badge="97.1% Operational" color="emerald" icon={CheckCircle2} />
        <StatusBadgeCard title="Inactive Outlets" count="40 Units" badge="Requires Action" color="rose" icon={XCircle} />
        <StatusBadgeCard title="Pipeline & Onboarding" count="12 Units" badge="In Onboarding" color="amber" icon={Clock} />
      </div>

      {/* Master Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Outlet Directory</h2>
          <span className="text-[11px] text-slate-400 font-medium">Showing {filteredFranchises.length} outlets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Franchise ID & Outlet</th>
                <th className="py-3.5 px-4 font-bold">Territory / Location</th>
                <th className="py-3.5 px-4 font-bold">Sales Manager</th>
                <th className="py-3.5 px-4 font-bold">Business Vertical</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Monthly Sales</th>
                <th className="py-3.5 px-4 font-bold">Collection</th>
                <th className="py-3.5 px-4 text-right font-bold">Audit Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFranchises.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{item.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{item.district}</div>
                    <div className="text-[10px] text-slate-400">{item.state}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{item.manager}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {item.businessType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.monthlySales}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600">{item.monthlyCollection}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      {item.complianceScore}
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

const StatusBadgeCard = ({ title, count, badge, color, icon: Icon }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight">{count}</div>
      <div className="text-[11px] text-slate-500 mt-1 font-semibold">{badge}</div>
    </div>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    Active: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    Inactive: 'bg-rose-50 text-rose-600 border-rose-200/80',
    'Pending Setup': 'bg-amber-50 text-amber-600 border-amber-200/80',
    'Notice Period': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status] || 'bg-slate-50 text-slate-500'}`}>
      {status}
    </span>
  );
};

export default DirectorFranchises;