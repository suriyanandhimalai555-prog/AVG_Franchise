import React, { useState, useEffect } from 'react';
import { MapPin, Plus, ChevronRight, Users, Loader2, Shield, Mail, Phone, X, Award, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const TerritoryManagement = () => {
  const [territories, setTerritories] = useState([]);
  const [loadingTerritories, setLoadingTerritories] = useState(true);

  const [selectedState, setSelectedState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockholders, setStockholders] = useState([]);
  const [loadingStockholders, setLoadingStockholders] = useState(false);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  // 1. Fetch live territory overview data from backend
  const fetchTerritoryOverview = async () => {
    setLoadingTerritories(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}/api/auth/territory-overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTerritories(data);
      } else {
        toast.error('Failed to load territory statistics.');
      }
    } catch (err) {
      console.error('Error fetching territory data:', err);
      toast.error('Server error while loading territories.');
    } finally {
      setLoadingTerritories(false);
    }
  };

  useEffect(() => {
    fetchTerritoryOverview();
  }, []);

  // 2. Fetch live Stockholders for the selected state
  const handleFetchStockholdersByState = async (stateName) => {
    setSelectedState(stateName);
    setIsModalOpen(true);
    setLoadingStockholders(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}/api/auth/stockholders-by-state?state=${encodeURIComponent(stateName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStockholders(data);
      } else {
        toast.error(`Failed to retrieve stockholders for ${stateName}`);
        setStockholders([]);
      }
    } catch (err) {
      console.error('Error fetching stockholders:', err);
      toast.error('Server connection error.');
      setStockholders([]);
    } finally {
      setLoadingStockholders(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Territory Allocation</h1>
          <p className="text-xs text-slate-500 mt-1">Live state-wise breakdown of franchises and stockholders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTerritoryOverview}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingTerritories ? 'animate-spin' : ''}`} />
          </button>
          <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all">
            <Plus className="w-4 h-4" /> Add Territory Boundary
          </button>
        </div>
      </div>

      {/* Dynamic Territory Loading / Grid */}
      {loadingTerritories ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          <span className="text-xs font-medium">Fetching live territory metrics...</span>
        </div>
      ) : territories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">No active territories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {territories.map((t) => (
            <div
              key={t.state}
              className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => handleFetchStockholdersByState(t.state)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{t.state}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Stockholders: <span className="font-bold text-blue-600">{t.stockholdersCount}</span>
                    </p>
                  </div>
                </div>

                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                  <Users className="w-3.5 h-3.5" /> Stockholders
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Districts Active</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">{t.districtCount}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Active Franchises</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5">{t.franchiseCount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIVE STOCKHOLDERS BY STATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Live Stockholders: {selectedState}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    List of registered investors operating under {selectedState}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingStockholders ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs font-medium">Fetching stockholders...</span>
                </div>
              ) : stockholders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No Stockholders found in {selectedState}</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                        <th className="py-3 px-4">User Code</th>
                        <th className="py-3 px-4">Stockholder Name</th>
                        <th className="py-3 px-4">Contact Details</th>
                        <th className="py-3 px-4">District & Area</th>
                        <th className="py-3 px-4">Territory</th>
                        <th className="py-3 px-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {stockholders.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">{s.userCode || 'N/A'}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{s.name}</td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-500"><Mail className="w-3 h-3" /> {s.email}</div>
                            <div className="flex items-center gap-1.5 text-slate-500"><Phone className="w-3 h-3" /> {s.mobile}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold block text-slate-800">{s.district || 'N/A'}</span>
                            <span className="text-[11px] text-slate-500">{s.area || 'N/A'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                              {s.territory || 'Unassigned'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerritoryManagement;