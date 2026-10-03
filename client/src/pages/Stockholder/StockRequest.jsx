import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Package, RefreshCw, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const StockRequest = () => {
  const [requests, setRequests] = useState([]);
  const [fetching, setFetching] = useState(true);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  const fetchRequests = async () => {
    setFetching(true);
    const token = localStorage.getItem('token');

    try {
      // Send Authorization header so backend can filter requests by the Stockholder's district
      const res = await fetch(`${baseUrl}/api/stock-requests`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && (result.success || Array.isArray(result))) {
        // Handle array responses directly or nested within result.data
        const data = Array.isArray(result) ? result : result.data || [];
        setRequests(data);
      } else {
        toast.error(result.message || 'Failed to fetch stock requests');
      }
    } catch (err) {
      toast.error('Failed to load incoming requests. Check server connection.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${baseUrl}/api/stock-requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (res.ok && (result.success || res.status === 200)) {
        toast.success(`Request marked as ${status.toLowerCase()}`);
        fetchRequests();
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Franchise Stock Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and manage inventory requests submitted by franchises in your district.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {fetching ? (
          <div className="py-12 flex justify-center items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>Fetching incoming requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No stock requests found for your district.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-6">Franchise</th>
                  <th className="py-3.5 px-6">Location / District</th>
                  <th className="py-3.5 px-6">Requested Item</th>
                  <th className="py-3.5 px-6">Quantity</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {req.franchise_name || req.user?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {req.district || req.user?.district || 'N/A'}
                          {req.state || req.user?.state ? `, ${req.state || req.user?.state}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-500" />
                      {req.stock?.stock_name || req.stock_name || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg font-bold border border-amber-200/60">
                        {req.requested_count} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                          <Clock className="w-3 h-3 animate-pulse" /> Pending
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
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {req.created_at ? new Date(req.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {req.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(req.id, 'APPROVED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(req.id, 'REJECTED')}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockRequest;