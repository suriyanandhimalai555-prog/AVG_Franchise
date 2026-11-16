import React, { useState, useEffect } from 'react';
import { User, Search, RefreshCw, Phone, Mail, Calendar, Eye, X, ShieldCheck, Plus, Trash2, FileText, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingWhatsapp, setSyncingWhatsapp] = useState(false);
  const [syncingMetaForm, setSyncingMetaForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Notification Banner State (replaces alert())
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form states for creating a new lead
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'Active',
    notes: ''
  });

  // Fetch leads on mount and setup auto-polling every 10 seconds for real-time UI updates
  useEffect(() => {
    fetchLeads(false); // Initial load with loading spinner

    const intervalId = setInterval(() => {
      fetchLeads(true); // Silent background fetch without showing the loader spinner
    }, 10000); // Polls every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Auto-hide notification banner after 4 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const fetchLeads = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/leads`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to load leads', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleSyncWhatsApp = async () => {
    try {
      setSyncingWhatsapp(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/leads/sync-whatsapp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setLeads(data.leads);
        showNotification('success', data.message || 'Successfully synced leads from WhatsApp interactions!');
      } else {
        showNotification('error', 'Failed to sync WhatsApp leads.');
      }
    } catch (error) {
      console.error('Sync error:', error);
      showNotification('error', 'An error occurred while syncing WhatsApp leads.');
    } finally {
      setSyncingWhatsapp(false);
    }
  };

  const handleSyncMetaForm = async () => {
    try {
      setSyncingMetaForm(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/leads/sync-meta-form`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ formId: import.meta.env.VITE_META_FORM_ID })
      });
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setLeads(data.leads);
        showNotification('success', data.message || 'Successfully synced leads from Meta Forms!');
      } else {
        const err = await response.json().catch(() => ({}));
        showNotification('error', err.error || 'Failed to sync Meta form leads.');
      }
    } catch (error) {
      console.error('Sync Meta form error:', error);
      showNotification('error', 'An error occurred while syncing Meta form leads.');
    } finally {
      setSyncingMetaForm(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newLeadData)
      });

      if (response.ok) {
        setIsAddModalOpen(false);
        setNewLeadData({ name: '', phone: '', email: '', status: 'Active', notes: '' });
        fetchLeads();
        showNotification('success', 'Lead created successfully!');
      } else {
        const err = await response.json().catch(() => ({}));
        showNotification('error', err.error || 'Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      showNotification('error', 'An error occurred while creating the lead.');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setSelectedLead(null);
        fetchLeads();
        showNotification('success', 'Lead deleted successfully!');
      } else {
        showNotification('error', 'Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      showNotification('error', 'An error occurred while deleting the lead.');
    }
  };

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.phone?.includes(searchTerm) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstRow, indexOfLastRow);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Custom Popup / Notification Banner */}
      {notification.message && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-sm transition-all animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setNotification({ type: '', message: '' })} 
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Title & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads Management</h1>
          <p className="text-xs text-slate-500 mt-1">View, track, and sync prospective client leads from Meta & WhatsApp</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            type="button"
            onClick={handleSyncWhatsApp}
            disabled={syncingWhatsapp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${syncingWhatsapp ? 'animate-spin' : ''}`} />
            <span>{syncingWhatsapp ? 'Syncing WA...' : 'Sync WhatsApp'}</span>
          </button>
          <button 
            type="button"
            onClick={handleSyncMetaForm}
            disabled={syncingMetaForm}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <FileText className={`w-3.5 h-3.5 ${syncingMetaForm ? 'animate-spin' : ''}`} />
            <span>{syncingMetaForm ? 'Syncing Forms...' : 'Sync Meta Forms'}</span>
          </button>
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
          <button 
            type="button"
            onClick={() => fetchLeads(false)}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Total Leads: <strong className="text-slate-900">{filteredLeads.length}</strong>
        </span>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Lead Name</th>
                <th className="py-3.5 px-6">Phone Number</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Source</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading leads data...
                  </td>
                </tr>
              ) : currentLeads.length > 0 ? (
                currentLeads.map((lead) => (
                  <tr key={lead.id || lead.phone} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-[#0437cc] text-xs shrink-0 shadow-sm">
                        {lead.name ? lead.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                      <span className="truncate">{lead.name || 'Unnamed Lead'}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {lead.email || 'No email provided'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {lead.leadSource || 'Manual'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        lead.status === 'Converted' 
                          ? 'bg-[#a6e71c]/20 text-emerald-800 border-[#a6e71c]' 
                          : 'bg-[#f77704]/10 text-[#f77704] border-[#f77704]/30'
                      }`}>
                        {lead.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#0437cc] text-slate-700 font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No leads found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50/50 border-t border-slate-200 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries per page</span>
          </div>

          <div className="font-medium">
            Showing {filteredLeads.length > 0 ? indexOfFirstRow + 1 : 0} to {Math.min(indexOfLastRow, filteredLeads.length)} of {filteredLeads.length} leads
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold bg-white border border-slate-200 rounded-lg text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Lead</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newLeadData.name}
                  onChange={(e) => setNewLeadData({...newLeadData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 919876543210"
                  value={newLeadData.phone}
                  onChange={(e) => setNewLeadData({...newLeadData, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={newLeadData.email}
                  onChange={(e) => setNewLeadData({...newLeadData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Status</label>
                <select
                  value={newLeadData.status}
                  onChange={(e) => setNewLeadData({...newLeadData, status: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Converted">Converted</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Notes / Remarks</label>
                <textarea
                  placeholder="Add any initial notes about the lead..."
                  value={newLeadData.notes}
                  onChange={(e) => setNewLeadData({...newLeadData, notes: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500 h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0437cc] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {selectedLead.name ? selectedLead.name.slice(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedLead.name || 'Lead Details'}</h3>
                  <p className="text-[10px] text-slate-400">Detailed client profile information</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedLead(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0437cc]" />
                    {selectedLead.phone}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#0437cc]" />
                    {selectedLead.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Source</span>
                  <p className="font-semibold text-slate-800">{selectedLead.leadSource || 'Manual'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Status</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedLead.status || 'Active'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Created At</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notes / Remarks</span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                    {selectedLead.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;