import React, { useState } from 'react';
import { X, UserPlus, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const ModalContainer = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const AddHierarchyUserModal = ({ isOpen, onClose, roleTitle, onSave }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', territory: 'Karnataka' });

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Create New ${roleTitle}`}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); onClose(); }} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
          <input required type="text" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rajesh Sharma" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Number</label>
            <input required type="tel" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none" 
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
            <input required type="email" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="user@avg.com" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Assigned Territory Boundary</label>
          <input type="text" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none" 
            value={formData.territory} onChange={e => setFormData({...formData, territory: e.target.value})} placeholder="e.g. South Region / Karnataka / Bangalore Urban" />
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
          <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20">Save & Provision User</button>
        </div>
      </form>
    </ModalContainer>
  );
};