import React, { useState, useEffect, useMemo } from 'react';
import {
  User, Search, RefreshCw, Phone, Mail, Eye, X, ShieldCheck,
  Plus, Trash2, FileText, ChevronLeft, ChevronRight, AlertCircle,
  CheckCircle2, Layers, Tag, Filter
} from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingWhatsapp, setSyncingWhatsapp] = useState(false);
  const [syncingMetaForm, setSyncingMetaForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormFilter, setSelectedFormFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [newLeadData, setNewLeadData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'Active',
    notes: ''
  });

  useEffect(() => {
    fetchLeads(false);
    const intervalId = setInterval(() => fetchLeads(true), 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFormFilter, rowsPerPage]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const getFormLabel = (lead) => {
    return (
      lead.rawFields?.['Lead Form Name'] ||
      (lead.formId ? `Form (${lead.formId})` : lead.leadSource || 'General')
    );
  };

  const fetchLeads = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(Array.isArray(data) ? data : []);
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        if (data.leads) setLeads(data.leads);
        showNotification('success', data.message || 'Synced WhatsApp leads!');
      } else {
        showNotification('error', data.error || 'Failed to sync WhatsApp leads.');
      }
    } catch {
      showNotification('error', 'Error syncing WhatsApp leads.');
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
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ formId: import.meta.env.VITE_META_FORM_ID })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        if (data.leads) setLeads(data.leads);
        showNotification('success', data.message || 'Synced Meta form leads!');
      } else {
        showNotification('error', data.error || 'Failed to sync Meta form leads.');
      }
    } catch {
      showNotification('error', 'Error syncing Meta form leads.');
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
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newLeadData)
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setIsAddModalOpen(false);
        setNewLeadData({ name: '', phone: '', email: '', status: 'Active', notes: '' });
        fetchLeads(false);
        showNotification('success', 'Lead created successfully!');
      } else {
        showNotification('error', data.error || 'Failed to create lead.');
      }
    } catch {
      showNotification('error', 'Error creating lead.');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (response.ok) {
      setSelectedLead(null);
      fetchLeads(false);
      showNotification('success', 'Lead deleted successfully!');
    } else {
      showNotification('error', 'Failed to delete lead.');
    }
  };

  const availableForms = useMemo(() => {
    const map = new Map();
    for (const lead of leads) {
      const key = lead.formId || getFormLabel(lead);
      if (!map.has(key)) {
        map.set(key, { key, label: getFormLabel(lead) });
      }
    }
    return Array.from(map.values());
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return leads.filter((lead) => {
      const formKey = lead.formId || getFormLabel(lead);
      if (selectedFormFilter !== 'ALL' && formKey !== selectedFormFilter) {
        return false;
      }
      if (!q) return true;

      const rawValuesText = lead.rawFields
        ? Object.entries(lead.rawFields)
            .map(([k, v]) => `${k} ${v}`)
            .join(' ')
            .toLowerCase()
        : '';

      return (
        lead.name?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.campaignName?.toLowerCase().includes(q) ||
        lead.adName?.toLowerCase().includes(q) ||
        getFormLabel(lead).toLowerCase().includes(q) ||
        rawValuesText.includes(q)
      );
    });
  }, [leads, searchTerm, selectedFormFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const indexOfLastRow = safeCurrentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstRow, indexOfLastRow);

  const getFormAnswersEntries = (rawFields) => {
    if (!rawFields || typeof rawFields !== 'object') return [];
    const skipKeys = new Set([
      'Lead Form Name',
      'Form ID',
      'Full Name',
      'Phone Number',
      'Email Address',
    ]);
    return Object.entries(rawFields).filter(([key]) => !skipKeys.has(key));
  };

  return (
    <div className="space-y-6">
      {notification.message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification({ type: '', message: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track client details, lead form sources, campaigns, and form-specific answers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncWhatsApp}
            disabled={syncingWhatsapp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${syncingWhatsapp ? 'animate-spin' : ''}`} />
            <span>{syncingWhatsapp ? 'Syncing WA...' : 'Sync WhatsApp'}</span>
          </button>
          <button
            onClick={handleSyncMetaForm}
            disabled={syncingMetaForm}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2"
          >
            <FileText className={`w-3.5 h-3.5 ${syncingMetaForm ? 'animate-spin' : ''}`} />
            <span>{syncingMetaForm ? 'Syncing Forms...' : 'Sync Meta Forms'}</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
          <button
            onClick={() => fetchLeads(false)}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Form Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search name, phone, email, form, campaign, or answer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFormFilter}
              onChange={(e) => setSelectedFormFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Forms ({leads.length})</option>
              {availableForms.map((form) => (
                <option key={form.key} value={form.key}>
                  {form.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start md:self-auto">
          Showing Leads: <strong className="text-slate-900">{filteredLeads.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Lead Name</th>
                <th className="py-3.5 px-5">Phone Number</th>
                <th className="py-3.5 px-5">Lead Form</th>
                <th className="py-3.5 px-5">Campaign Name</th>
                <th className="py-3.5 px-5">Ad Name</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
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
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-[#0437cc] text-xs shrink-0">
                          {lead.name ? lead.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate">{lead.name || 'Unnamed Lead'}</div>
                          {lead.email && <div className="text-[11px] text-slate-400 truncate">{lead.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 max-w-[170px] truncate">
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="truncate">{getFormLabel(lead)}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-[160px] truncate">
                        <Layers className="w-3 h-3 shrink-0" />
                        <span className="truncate">{lead.campaignName || 'N/A'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 max-w-[160px] truncate">
                        <Tag className="w-3 h-3 shrink-0" />
                        <span className="truncate">{lead.adName || 'N/A'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#0437cc] text-slate-700 font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View More</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLeads.length > 0 && (
          <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span>
                Page <strong>{safeCurrentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0437cc] text-white flex items-center justify-center font-bold text-sm">
                  {selectedLead.name ? selectedLead.name.slice(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedLead.name || 'Lead Details'}</h3>
                  <p className="text-[11px] text-slate-500">
                    Form: <strong className="text-slate-700">{getFormLabel(selectedLead)}</strong>
                    {selectedLead.rawFields?.['Submitted At'] ? ` • ${selectedLead.rawFields['Submitted At']}` : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Campaign & Ad Details */}
              <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Campaign Name
                  </span>
                  <p className="font-semibold text-indigo-900">{selectedLead.campaignName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Ad Name
                  </span>
                  <p className="font-semibold text-indigo-900">{selectedLead.adName || 'N/A'}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Phone Number
                  </span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0437cc]" />
                    {selectedLead.phone}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#0437cc]" />
                    {selectedLead.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* All Form Data, Questions & Answers */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  All Form Data, Questions & Answers ({getFormLabel(selectedLead)})
                </span>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                  {getFormAnswersEntries(selectedLead.rawFields).length > 0 ? (
                    getFormAnswersEntries(selectedLead.rawFields).map(([question, answer], idx) => (
                      <div key={idx} className="border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                        <span className="text-[11px] font-bold text-slate-500 block">{question}</span>
                        <span className="text-xs font-semibold text-slate-900 mt-0.5 block">
                          {answer !== undefined && answer !== null && String(answer).trim() !== ''
                            ? String(answer)
                            : 'No answer provided'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No custom form answers found for this lead.</p>
                  )}
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Notes / Remarks
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                    {selectedLead.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLead}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Lead</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadData.name}
                  onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newLeadData.phone}
                  onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newLeadData.email}
                  onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows="3"
                  value={newLeadData.notes}
                  onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
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
      )}
    </div>
  );
};

export default Leads;