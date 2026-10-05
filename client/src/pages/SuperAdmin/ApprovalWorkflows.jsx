import React, { useState, useEffect } from 'react';
import { Clock, Check, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

const ApprovalWorkflows = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [notification, setNotification] = useState(null);

  const fetchPendingApprovals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/pending-approvals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setPendingList(data);
      }
    } catch (err) {
      console.error('Error fetching pending list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleAction = async (userId, action) => {
    setActionLoading((prev) => ({ ...prev, [userId]: action }));
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${action}-franchise/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', text: data.message });
        setPendingList((prev) => prev.filter((item) => item.id !== userId));
      } else {
        setNotification({ type: 'error', text: data.message || 'Action failed' });
      }
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approvals Queue</h1>
          <p className="text-xs text-slate-500 mt-1">Review and approve new franchise onboarding applications</p>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : pendingList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
          No pending approvals found.
        </div>
      ) : (
        <div className="space-y-3">
          {pendingList.map((p) => (
            <div key={p.id} className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{p.businessType || 'Franchise Request'}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.userCode}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{p.district}, {p.state}</p>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    Requested by <span className="text-slate-600 font-semibold">{p.name} ({p.email})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleAction(p.id, 'reject')}
                  disabled={!!actionLoading[p.id]}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {actionLoading[p.id] === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject
                </button>
                <button
                  onClick={() => handleAction(p.id, 'approve')}
                  disabled={!!actionLoading[p.id]}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {actionLoading[p.id] === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflows;