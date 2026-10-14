import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, CheckCircle2, XCircle, Users, IndianRupee, Wallet, 
  Clock, AlertTriangle, TrendingUp, Search, Eye, 
  UserPlus, ShieldAlert, Loader2, X 
} from 'lucide-react';
import AttendanceCheckInWidget from '../../components/AttendanceCheckInWidget';

const RAW_API_URL = import.meta.env.VITE_APP_BASE_URL || '';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const StateHeadDashboard = () => {
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateName, setStateName] = useState("");
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token') || '';

  // 1. Fetch user profile to get assigned state
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        if (userData.state) {
          setStateName(userData.state);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, [token]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.state) {
      setStateName(user.state);
    } else {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  // 2. Fetch live franchises under the state jurisdiction
  const fetchStateFranchises = useCallback(async () => {
    if (!stateName) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users-by-role-and-state/FRANCHISE?state=${encodeURIComponent(stateName)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFranchises(data);
      }
    } catch (err) {
      console.error('Error fetching franchises:', err);
    } finally {
      setLoading(false);
    }
  }, [stateName, token]);

  useEffect(() => {
    if (stateName) {
      fetchStateFranchises();
    }
  }, [stateName, fetchStateFranchises]);

  // Computed metrics from dynamic live data
  const totalFranchises = franchises.length;
  const activeFranchises = franchises.filter(f => f.isActive).length;
  const inactiveFranchises = totalFranchises - activeFranchises;

  const filteredFranchises = franchises.filter(f => 
    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.userCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!stateName) {
    return (
      <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading state jurisdiction data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">State Head Operations Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Territory-wide management & operations</p>
        </div>
        <AttendanceCheckInWidget />
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{stateName} State Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time state overview, franchisee counts, and financial performance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl">
            Jurisdiction: {stateName}
          </div>
        </div>
      </div>

      {/* Row 1: Key Operational Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniMetricCard title="Total Outlets" value={totalFranchises} color="blue" icon={Building2} />
        <MiniMetricCard title="Active Outlets" value={activeFranchises} color="emerald" icon={CheckCircle2} />
        <MiniMetricCard title="Inactive Outlets" value={inactiveFranchises} color="slate" icon={XCircle} />
        <MiniMetricCard title="Temp Closed" value={0} color="amber" icon={AlertTriangle} />
        <MiniMetricCard title="Perm Closed" value={0} color="rose" icon={XCircle} />
        <MiniMetricCard title="Sales Managers" value="Active" color="indigo" icon={Users} />
      </div>

      {/* Row 2: Financial Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StateMetricCard 
          title="Sales Performance" 
          primaryVal="₹4.20 Cr" 
          primaryLabel="Monthly Sales"
          secondaryVal="₹14.20 L"
          secondaryLabel="Today Sales"
          badge="+12.4% MoM"
          isPositive={true}
          icon={IndianRupee}
          color="blue"
        />
        <StateMetricCard 
          title="Collection Summary" 
          primaryVal="₹4.00 Cr" 
          primaryLabel="Monthly Collection"
          secondaryVal="₹13.50 L"
          secondaryLabel="Today Collection"
          badge="95.2% Efficiency"
          isPositive={true}
          icon={Wallet}
          color="emerald"
        />
        <StateMetricCard 
          title="Outstanding Recovery" 
          primaryVal="₹18.50 L" 
          primaryLabel="Total Outstanding"
          secondaryVal="0 Overdue"
          secondaryLabel="Overdue Outlets"
          badge="High Priority"
          isPositive={false}
          icon={Clock}
          color="rose"
        />
        <StateMetricCard 
          title="Growth & Approvals" 
          primaryVal={`+${totalFranchises}`} 
          primaryLabel="Total Registered"
          secondaryVal="0 Pending"
          secondaryLabel="Pending Queue"
          badge="Up to Date"
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
              Assigned Franchise Network ({stateName})
            </h2>
            <p className="text-[11px] text-slate-400">Click inspect to view complete franchise details and records</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-full sm:w-60 shadow-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search franchise or code..." 
                className="bg-transparent border-none outline-none text-slate-700 text-xs w-full"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Franchise Code & Name</th>
                <th className="py-3.5 px-4 font-bold">District / Area</th>
                <th className="py-3.5 px-4 font-bold">Contact Email</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-600 mb-1" />
                    <span>Loading franchise network...</span>
                  </td>
                </tr>
              ) : filteredFranchises.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No franchises found registered in {stateName}.
                  </td>
                </tr>
              ) : (
                filteredFranchises.map((fr) => (
                  <tr key={fr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{fr.name}</div>
                      <div className="text-[10px] font-mono text-blue-600">{fr.userCode}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{fr.district || 'General'} ({fr.area || stateName})</td>
                    <td className="py-3.5 px-4 text-slate-600">{fr.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${fr.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                        {fr.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
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
                ))
              )}
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

const StateMetricCard = ({ title, primaryVal, primaryLabel, secondaryVal, secondaryLabel, badge, isPositive, icon: Icon }) => {
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

const FranchiseHistoryModal = ({ franchise, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">{franchise.userCode} • Franchise Record</span>
            <h3 className="text-lg font-bold text-slate-900">{franchise.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block">District / State</span>
              <strong className="text-slate-900 text-sm">{franchise.district || 'N/A'}, {franchise.state}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Mobile Number</span>
              <strong className="text-slate-900 text-sm font-mono">{franchise.mobile}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Email Address</span>
              <strong className="text-slate-900 text-sm">{franchise.email}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Account Status</span>
              <strong className="text-emerald-600 text-sm">{franchise.isActive ? 'Active' : 'Inactive'}</strong>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-900">
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateHeadDashboard;