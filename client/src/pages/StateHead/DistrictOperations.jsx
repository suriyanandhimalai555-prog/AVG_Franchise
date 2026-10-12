import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Users, Building2, Loader2, ShieldAlert } from 'lucide-react';

const RAW_API_URL = import.meta.env.VITE_APP_BASE_URL || '';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const DistrictOperations = () => {
  const [loading, setLoading] = useState(true);
  const [assignedDistrictsData, setAssignedDistrictsData] = useState([]);
  const [stateHeadState, setStateHeadState] = useState('');

  const token = localStorage.getItem('token') || '';

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

  const fetchAssignedDistricts = useCallback(async () => {
    if (!stateHeadState) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users-by-role/SALES_MANAGER`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const salesManagers = res.ok ? await res.json() : [];

      // Filter sales managers belonging strictly to the State Head's state and who have a district assigned
      const filteredManagers = salesManagers.filter(
        (m) => 
          m.state?.trim().toLowerCase() === stateHeadState.trim().toLowerCase() && 
          m.district && 
          m.district.trim() !== ''
      );

      // Map only the assigned districts
      const aggregated = filteredManagers.map((manager) => ({
        district: manager.district,
        managerName: manager.name,
        managerEmail: manager.email,
        managerMobile: manager.mobile,
        franchiseCount: Math.floor(Math.random() * 25) + 5,
        collectionTotal: `₹${(Math.random() * 50 + 10).toFixed(1)} Lakhs`
      }));

      setAssignedDistrictsData(aggregated);
    } catch (err) {
      console.error('Error fetching assigned districts data:', err);
    } finally {
      setLoading(false);
    }
  }, [stateHeadState, token]);

  useEffect(() => {
    if (stateHeadState) {
      fetchAssignedDistricts();
    }
  }, [stateHeadState, fetchAssignedDistricts]);

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">District Operations ({stateHeadState})</h1>
          <p className="text-xs text-slate-500 mt-1">
            Assigned districts and sales manager operations across <span className="font-semibold text-slate-700">{stateHeadState}</span>
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl">
          State Jurisdiction: {stateHeadState}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200/80 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-xs font-medium text-slate-500">Loading assigned districts...</span>
        </div>
      ) : assignedDistrictsData.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 space-y-2">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No districts assigned yet</p>
          <p className="text-[11px] text-slate-400">No Sales Managers have been assigned to districts in {stateHeadState} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedDistrictsData.map((item) => (
            <div key={item.district} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" /> {item.district} District
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Assigned Active
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" /> Sales Manager
                </div>
                <div className="text-xs font-semibold text-slate-800">{item.managerName}</div>
                {item.managerMobile && (
                  <div className="text-[10px] text-slate-500 font-mono">Ph: {item.managerMobile}</div>
                )}
              </div>

              {/* <div className="text-xs font-bold text-slate-800 pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="flex items-center gap-1 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> {item.franchiseCount} Franchises
                </span>
                <span className="text-emerald-600 font-bold">{item.collectionTotal}</span>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DistrictOperations;