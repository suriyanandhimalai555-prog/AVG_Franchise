import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Loader2, 
  RefreshCw, 
  ArrowUpRight, 
  User, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';

const HIERARCHY_TITLES = {
  SALES_MANAGER: 'Sales Manager Escalation Desk',
  STATE_HEAD: 'State Head Escalation Desk',
  HEAD_COORDINATOR: 'Head Coordinator Escalation Desk',
  DIRECTOR: 'Directorate Escalation Desk',
  ADMIN: 'Operational Admin Escalation Desk',
  SUPER_ADMIN: 'Super Admin Master Ticket Desk',
};

const NEXT_LEVEL_MAPPING = {
  SALES_MANAGER: 'State Head',
  STATE_HEAD: 'Head Coordinator',
  HEAD_COORDINATOR: 'Director',
  DIRECTOR: 'Admin',
  ADMIN: 'Super Admin',
  SUPER_ADMIN: 'Highest Level (Terminal)',
};

const TicketManager = ({ role = 'SALES_MANAGER' }) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  const [tickets, setTickets] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [actionType, setActionType] = useState(null); // 'RESOLVE' | 'FORWARD'
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  // Fetch tickets assigned to this specific role level
  const fetchTickets = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${baseUrl}/api/tickets?role=${role}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTickets(data.data || []);
      } else {
        toast.error(data.message || 'Failed to load assigned tickets.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Server error while loading tickets.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [role]);

  // Handle Forward / Escalate Ticket
  const handleForward = async () => {
    if (!notes.trim()) {
      return toast.error('Please provide an escalation reason.');
    }
    setSubmitting(true);

    try {
      const res = await fetch(`${baseUrl}/api/tickets/${activeTicket.id}/forward`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forwardReason: notes }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || 'Ticket escalated successfully!');
        closeModal();
        fetchTickets();
      } else {
        toast.error(data.message || 'Failed to escalate ticket.');
      }
    } catch (err) {
      toast.error('Server connection failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Resolve Ticket
  const handleResolve = async () => {
    if (!notes.trim()) {
      return toast.error('Please enter resolution notes.');
    }
    setSubmitting(true);

    try {
      const res = await fetch(`${baseUrl}/api/tickets/${activeTicket.id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionNotes: notes }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Ticket marked as resolved!');
        closeModal();
        fetchTickets();
      } else {
        toast.error(data.message || 'Failed to resolve ticket.');
      }
    } catch (err) {
      toast.error('Server connection failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setActiveTicket(null);
    setActionType(null);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
            {role.replace('_', ' ')}
          </span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight mt-1">
            {HIERARCHY_TITLES[role] || 'Escalation Support Desk'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming franchise support tickets. Resolve issues directly or escalate to higher hierarchy.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition flex items-center gap-2 text-xs font-semibold"
          title="Refresh Tickets"
        >
          <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Pending Actions</h2>
          <span className="text-xs font-semibold text-slate-400">Total: {tickets.length}</span>
        </div>

        {fetching ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>Loading assigned tickets...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center text-xs font-medium text-slate-400">
            No active tickets pending at your level. All clear!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Ticket Details</th>
                  <th className="py-3.5 px-6">Franchise</th>
                  <th className="py-3.5 px-6">Priority</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-amber-600 font-mono text-[11px]">{t.ticket_number}</div>
                      <div className="font-bold text-slate-800 text-xs mt-0.5">{t.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</div>
                      {t.resolution_notes && (
                        <div className="mt-1 text-[10px] bg-slate-100 p-1.5 rounded text-slate-600 italic">
                          {t.resolution_notes}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {t.franchise_name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'CRITICAL' 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : t.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        t.status === 'RESOLVED' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : t.status === 'FORWARDED'
                          ? 'bg-purple-50 text-purple-600 border border-purple-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => { setActiveTicket(t); setActionType('RESOLVE'); }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>

                      {role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => { setActiveTicket(t); setActionType('FORWARD'); }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Escalate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal (Resolve or Escalate) */}
      {activeTicket && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold tracking-wide">
                  {actionType === 'RESOLVE' ? 'Resolve Ticket' : `Escalate to ${NEXT_LEVEL_MAPPING[role]}`}
                </h3>
              </div>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <div className="font-bold text-slate-800">{activeTicket.subject}</div>
                <div className="text-slate-500">Franchise: {activeTicket.franchise_name}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {actionType === 'RESOLVE' ? 'Resolution Details' : 'Escalation Reason'}
                </label>
                <textarea
                  rows="4"
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    actionType === 'RESOLVE'
                      ? 'Describe how this issue was resolved...'
                      : 'Provide details on why this issue is being escalated to the next level...'
                  }
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={actionType === 'RESOLVE' ? handleResolve : handleForward}
                  className={`w-1/2 py-2.5 font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 ${
                    actionType === 'RESOLVE'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-500/20'
                  }`}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : actionType === 'RESOLVE' ? (
                    'Confirm Resolve'
                  ) : (
                    'Confirm Escalation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManager;