import React, { useState, useEffect } from 'react';
import { Send, Package, Hash, FileText, Loader2, Plus, RefreshCw, X, Clock, CheckCircle2, XCircle, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StockRequestFranchise = () => {
  const [stocks, setStocks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    stockId: '',
    requestedCount: '',
    notes: '',
  });

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  const getAuthHeader = () => {
    const token = localStorage.getItem('token') || '';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/users/profile`, {
        headers: getAuthHeader(),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setProfile(result.data);
      }
    } catch (err) {
      console.error('Fetch Profile Error:', err);
    }
  };

  const fetchStocks = async () => {
    setLoadingStocks(true);
    try {
      const res = await fetch(`${baseUrl}/api/stocks`, {
        headers: getAuthHeader(),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStocks(result.data || []);
      } else {
        toast.error(result.message || 'Failed to load stock list');
      }
    } catch (err) {
      toast.error('Failed to load stock list');
    } finally {
      setLoadingStocks(false);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch(`${baseUrl}/api/stock-requests`, {
        headers: getAuthHeader(),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setRequests(result.data || []);
      } else {
        toast.error(result.message || 'Failed to load requested stock history');
      }
    } catch (err) {
      toast.error('Failed to load requested stock history');
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStocks();
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${baseUrl}/api/stock-requests/create`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success('Stock request sent to Stockholder!');
        setFormData({ stockId: '', requestedCount: '', notes: '' });
        setIsModalOpen(false);
        fetchRequests();
      } else {
        toast.error(result.message || 'Failed to submit request');
      }
    } catch (err) {
      toast.error('Server connection failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Franchise Stock Requests</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Request items from Stockholder inventory and track order status in real time.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchStocks();
              fetchRequests();
            }}
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingRequests || loadingStocks ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              fetchStocks();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ask Stock Request</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">My Stock Request History</h2>
          <span className="text-xs font-semibold text-slate-400">Total Requests: {requests.length}</span>
        </div>

        {loadingRequests ? (
          <div className="py-12 flex justify-center items-center gap-2 text-xs font-medium text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Loading requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-xs font-medium text-slate-400">
            No stock requests found. Click <strong className="text-slate-600">Ask Stock Request</strong> to raise one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Franchise</th>
                  <th className="py-3.5 px-6">Requested Item</th>
                  <th className="py-3.5 px-6">Quantity</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Notes</th>
                  <th className="py-3.5 px-6">Request Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">
                      <div className="flex flex-col gap-0.5">
                        <span>{req.franchise?.name || 'My Franchise'}</span>
                        {req.franchise?.businessType && (
                          <span className="w-fit text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/60 uppercase">
                            {req.franchise.businessType}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600 shrink-0" />
                      {req.stock?.stock_name || 'Item Removed'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold border border-blue-200/60">
                        {req.requested_count} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                          <Clock className="w-3 h-3 animate-pulse" /> Pending Approval
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                      {req.notes || '-'}
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {new Date(req.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold tracking-wide">Raise Stock Request</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Auto-Fetched Franchise & Business Type Info Header */}
              {profile && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{profile.name}</p>
                      <p className="text-[11px] text-slate-500">{profile.district}</p>
                    </div>
                  </div>
                  {profile.businessType && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/60 uppercase">
                      {profile.businessType}
                    </span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Product Item
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <select
                    required
                    value={formData.stockId}
                    onChange={(e) => setFormData({ ...formData, stockId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="">{loadingStocks ? 'Loading available items...' : '-- Choose Stock Item --'}</option>
                    {stocks.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.stock_name} (Available: {item.count} units | {item.single_stock_weight} kg each)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Requested Quantity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 25"
                    value={formData.requestedCount}
                    onChange={(e) => setFormData({ ...formData, requestedCount: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Notes / Special Instructions
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    rows="2"
                    placeholder="Optional notes for Stockholder..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockRequestFranchise;