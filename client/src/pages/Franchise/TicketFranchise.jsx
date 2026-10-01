import React, { useState, useEffect } from 'react';
import { LifeBuoy, Plus, Send, Clock, CheckCircle2, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketFranchise = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  const [tickets, setTickets] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
  });

  const fetchTickets = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${baseUrl}/api/tickets?role=FRANCHISE&franchiseId=${user.id || 1}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTickets(data.data);
      }
    } catch (err) {
      toast.error('Failed to load tickets.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          franchiseId: user.id || 1,
          franchiseName: user.name || 'Franchise Partner',
          ...formData,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Ticket submitted! Assigned to Sales Manager.');
        setIsModalOpen(false);
        setFormData({ subject: '', description: '', priority: 'MEDIUM' });
        fetchTickets();
      } else {
        toast.error(data.message || 'Error creating ticket.');
      }
    } catch (err) {
      toast.error('Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Franchise Support & Escalation</h1>
          <p className="text-xs text-slate-500 mt-1">Raise support requests. Unresolved tickets automatically escalate up management.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Raise Ticket
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800">Support Tickets</h2>
          <span className="text-xs font-semibold text-slate-400">Total: {tickets.length}</span>
        </div>

        {fetching ? (
          <div className="py-12 flex justify-center items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No support tickets raised yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b">
                  <th className="py-3.5 px-6">Ticket No</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Assigned Level</th>
                  <th className="py-3.5 px-6">Priority</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-bold text-amber-600">{t.ticket_number}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{t.subject}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {t.current_level.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-[11px]">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-amber-500" /> New Support Request
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Stock delivery delay"
                  className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information..."
                  className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2 bg-amber-500 hover:bg-amber-600 font-bold rounded-xl text-xs flex justify-center items-center gap-1"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketFranchise;