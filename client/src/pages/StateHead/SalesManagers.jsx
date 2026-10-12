import React, { useState, useEffect, useCallback } from 'react';
import { Users, Mail, Phone, MapPin, Loader2, ShieldAlert, Search, Briefcase } from 'lucide-react';

const RAW_API_URL = import.meta.env.VITE_APP_BASE_URL || '';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const SalesManagers = () => {
  const [loading, setLoading] = useState(true);
  const [salesManagers, setSalesManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateHeadState, setStateHeadState] = useState('');

  const token = localStorage.getItem('token') || '';

  // Fetch logged-in user profile to get their assigned state
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        if (userData.state) {
          setStateHeadState(userData.state);
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          localUser.state = userData.state;
          localStorage.setItem('user', JSON.stringify(localUser));
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, [token]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.state) {
      setStateHeadState(user.state);
    } else {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  // Fetch Sales Managers filtered by state jurisdiction
  const fetchSalesManagers = useCallback(async () => {
    if (!stateHeadState) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users-by-role/SALES_MANAGER`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Filter strictly by the State Head's state jurisdiction
        const filtered = data.filter(
          (m) => m.state?.trim().toLowerCase() === stateHeadState.trim().toLowerCase()
        );
        setSalesManagers(filtered);
      }
    } catch (err) {
      console.error('Error fetching sales managers:', err);
    } finally {
      setLoading(false);
    }
  }, [stateHeadState, token]);

  useEffect(() => {
    if (stateHeadState) {
      fetchSalesManagers();
    }
  }, [stateHeadState, fetchSalesManagers]);

  // Search filter implementation
  const filteredManagers = salesManagers.filter((m) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.district?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.userCode?.toLowerCase().includes(term)
    );
  });

  if (!stateHeadState) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3">
        <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">State Assignment Missing</h2>
        <p className="text-xs text-slate-500">Your account is not mapped to any state. Please contact the Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Managers ({stateHeadState})</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage state sales executives and territory assignments across <span className="font-semibold text-slate-700">{stateHeadState}</span>
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl">
          Jurisdiction: {stateHeadState}
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, district, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredManagers.length} {filteredManagers.length === 1 ? 'Manager' : 'Managers'}
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">User Code</th>
                <th className="py-3.5 px-4 font-bold">Manager Name</th>
                <th className="py-3.5 px-4 font-bold">Contact Info</th>
                <th className="py-3.5 px-4 font-bold">District / Territory</th>
                <th className="py-3.5 px-4 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span>Loading sales managers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Users className="w-6 h-6 text-slate-300" />
                      <span>No Sales Managers found in {stateHeadState}.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => (
                  <tr key={manager.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {manager.userCode || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{manager.name}</div>
                      <div className="text-[10px] text-slate-400">Sales Executive</div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{manager.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                        <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{manager.mobile}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-800 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{manager.district || 'General'} District</span>
                      </div>
                      {manager.territory && (
                        <div className="text-[10px] text-slate-400 mt-0.5">Territory: {manager.territory}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesManagers;