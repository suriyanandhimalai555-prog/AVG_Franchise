import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, XCircle, Users, IndianRupee, Wallet, 
  Clock, AlertTriangle, TrendingUp, Search, Eye, Filter, 
  UserPlus, MapPin, X, ArrowUpRight, ArrowDownRight, Layers 
} from 'lucide-react';

const stateDashboardData = {
  stateName: "Tamil Nadu",
  totalFranchises: 420,
  activeFranchises: 395,
  inactiveFranchises: 25,
  temporaryClosed: 18,
  permanentClosed: 7,
  salesManagersCount: 12,
  newSignupsThisMonth: 18,
  todaySales: "₹14.20 L",
  monthlySales: "₹4.20 Cr",
  todayCollection: "₹13.50 L",
  monthlyCollection: "₹4.00 Cr",
  totalOutstanding: "₹18.50 L",
  pendingApprovalsCount: 6,
  franchises: [
    { id: "FR-TN-101", name: "AVG Superstore Anna Nagar", district: "Chennai", manager: "V. Anand", type: "Retail Hub", status: "Active", todaySales: "₹45,000", monthlySales: "₹12.4 L", outstanding: "₹0", health: "98%" },
    { id: "FR-TN-102", name: "AVG Express T. Nagar", district: "Chennai", manager: "V. Anand", type: "Express Outlet", status: "Active", todaySales: "₹38,000", monthlySales: "₹9.8 L", outstanding: "₹12,000", health: "94%" },
    { id: "FR-TN-103", name: "AVG Mart Gandhipuram", district: "Coimbatore", manager: "S. Prabhu", type: "Retail Hub", status: "Active", todaySales: "₹52,000", monthlySales: "₹15.2 L", outstanding: "₹45,000", health: "96%" },
    { id: "FR-TN-104", name: "AVG Store KKL", district: "Madurai", manager: "M. Karthik", type: "Mini Outlet", status: "Temporary Closed", todaySales: "₹0", monthlySales: "₹1.1 L", outstanding: "₹85,000", health: "60%" },
    { id: "FR-TN-105", name: "AVG Hyper Salem Central", district: "Salem", manager: "K. Vignesh", type: "Hypermarket", status: "Permanent Closed", todaySales: "₹0", monthlySales: "₹0", outstanding: "₹2.4 L", health: "0%" },
  ]
};

const StateHeadDashboard = () => {
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFranchises = stateDashboardData.franchises.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{stateDashboardData.stateName} State Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time state overview, franchisee counts, financial performance, and closures</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors">
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Franchise Signup</span>
          </button>
        </div>
      </div>

      {/* Row 1: Key Operational Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniMetricCard title="Total Outlets" value={stateDashboardData.totalFranchises} color="blue" icon={Building2} />
        <MiniMetricCard title="Active Outlets" value={stateDashboardData.activeFranchises} color="emerald" icon={CheckCircle2} />
        <MiniMetricCard title="Inactive Outlets" value={stateDashboardData.inactiveFranchises} color="slate" icon={XCircle} />
        <MiniMetricCard title="Temp Closed" value={stateDashboardData.temporaryClosed} color="amber" icon={AlertTriangle} />
        <MiniMetricCard title="Perm Closed" value={stateDashboardData.permanentClosed} color="rose" icon={XCircle} />
        <MiniMetricCard title="Sales Managers" value={stateDashboardData.salesManagersCount} color="indigo" icon={Users} />
      </div>

      {/* Row 2: Financial Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StateMetricCard 
          title="Sales Performance" 
          primaryVal={stateDashboardData.monthlySales} 
          primaryLabel="Monthly Sales"
          secondaryVal={stateDashboardData.todaySales}
          secondaryLabel="Today Sales"
          badge="+12.4% MoM"
          isPositive={true}
          icon={IndianRupee}
          color="blue"
        />
        <StateMetricCard 
          title="Collection Summary" 
          primaryVal={stateDashboardData.monthlyCollection} 
          primaryLabel="Monthly Collection"
          secondaryVal={stateDashboardData.todayCollection}
          secondaryLabel="Today Collection"
          badge="95.2% Efficiency"
          isPositive={true}
          icon={Wallet}
          color="emerald"
        />
        <StateMetricCard 
          title="Outstanding Recovery" 
          primaryVal={stateDashboardData.totalOutstanding} 
          primaryLabel="Total Outstanding"
          secondaryVal="14 Franchises Overdue"
          secondaryLabel="Overdue Outlets"
          badge="High Priority"
          isPositive={false}
          icon={Clock}
          color="rose"
        />
        <StateMetricCard 
          title="Growth & Approvals" 
          primaryVal={`+${stateDashboardData.newSignupsThisMonth}`} 
          primaryLabel="New Signups (Month)"
          secondaryVal={`${stateDashboardData.pendingApprovalsCount} Approvals`}
          secondaryLabel="Pending Queue"
          badge="Action Needed"
          isPositive={true}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Master State Franchise Operations Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assigned Franchise Network ({stateDashboardData.stateName})
            </h2>
            <p className="text-[11px] text-slate-400">Click inspect to view complete franchise history and ledger</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-full sm:w-60 shadow-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search franchise or ID..." 
                className="bg-transparent border-none outline-none text-slate-700 text-xs w-full"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Franchise ID & Name</th>
                <th className="py-3.5 px-4 font-bold">District</th>
                <th className="py-3.5 px-4 font-bold">Assigned Manager</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Today Sales</th>
                <th className="py-3.5 px-4 font-bold">Monthly Sales</th>
                <th className="py-3.5 px-4 font-bold">Outstanding</th>
                <th className="py-3.5 px-4 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFranchises.map((fr) => (
                <tr key={fr.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{fr.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{fr.id} • {fr.type}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{fr.district}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{fr.manager}</td>
                  <td className="py-3.5 px-4">
                    <FranchiseStatusBadge status={fr.status} />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{fr.todaySales}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{fr.monthlySales}</td>
                  <td className="py-3.5 px-4 font-semibold text-rose-600">{fr.outstanding}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button 
                      onClick={() => setSelectedFranchise(fr)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-semibold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Franchise Detailed History Modal */}
      {selectedFranchise && (
        <FranchiseHistoryModal 
          franchise={selectedFranchise} 
          onClose={() => setSelectedFranchise(null)} 
        />
      )}
    </div>
  );
};

/* Component Helpers */

const MiniMetricCard = ({ title, value, color, icon: Icon }) => {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    slate: 'bg-slate-100 border-slate-200 text-slate-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
    rose: 'bg-rose-50 border-rose-200 text-rose-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
  };

  return (
    <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-1.5 rounded-lg border ${colorMap[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-xl font-bold text-slate-900 mt-2 tracking-tight">{value}</div>
    </div>
  );
};

const StateMetricCard = ({ title, primaryVal, primaryLabel, secondaryVal, secondaryLabel, badge, isPositive, icon: Icon, color }) => {
  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {badge}
        </span>
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-bold text-slate-900 mt-1">{primaryVal}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{primaryLabel}</div>
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">{secondaryLabel}:</span>
        <strong className="text-slate-800 font-bold">{secondaryVal}</strong>
      </div>
    </div>
  );
};

const FranchiseStatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Inactive': 'bg-slate-100 text-slate-600 border-slate-200',
    'Temporary Closed': 'bg-amber-50 text-amber-600 border-amber-200',
    'Permanent Closed': 'bg-rose-50 text-rose-600 border-rose-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

/* Franchise Complete History Inspector Modal */
const FranchiseHistoryModal = ({ franchise, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">{franchise.id} • Complete Franchise Record</span>
            <h3 className="text-lg font-bold text-slate-900">{franchise.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block">District</span>
              <strong className="text-slate-900 text-sm">{franchise.district}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Sales Manager</span>
              <strong className="text-slate-900 text-sm">{franchise.manager}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Current Status</span>
              <FranchiseStatusBadge status={franchise.status} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Compliance Health</span>
              <strong className="text-emerald-600 text-sm">{franchise.health}</strong>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2">Historical Ledger & Transactions</h4>
            <div className="border border-slate-200/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-mono text-[11px]">2026-08-24</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">Daily Royalty Remittance</td>
                    <td className="py-2 px-3 font-bold text-emerald-600">₹14,200</td>
                    <td className="py-2 px-3 text-emerald-600 font-bold">Settled</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-[11px]">2026-08-20</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">Inventory Stock Order</td>
                    <td className="py-2 px-3 font-bold text-slate-800">₹85,000</td>
                    <td className="py-2 px-3 text-blue-600 font-bold">Delivered</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-900">
            Close Audit File
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateHeadDashboard;