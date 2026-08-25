import React, { useState } from 'react';
import { Building2, Save, FileText, CheckCircle2 } from 'lucide-react';

const NewFranchiseSignup = () => {
  const [formData, setFormData] = useState({
    name: '', owner: '', phone: '', state: 'TN', district: 'CHN', taluk: 'Chennai South',
    deposit: '', fee: '', businessType: 'AVG Mart'
  });

  const generateIdPreview = () => `AVG-${formData.state}-${formData.district}-00125`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Franchise Provisioning & Signup</h1>
        <p className="text-xs text-slate-500">Register new franchise store, auto-generate unique ID, and map territory hierarchy</p>
      </div>

      <form className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
        {/* Auto Generated ID Header */}
        <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase">Auto-Generated Unique Franchise ID</span>
            <div className="text-lg font-mono font-bold text-blue-900">{generateIdPreview()}</div>
          </div>
          <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-xl">Rule: AVG-[STATE]-[DIST]-[NUM]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Franchise Branch Name</label>
            <input type="text" className="w-full p-2.5 border rounded-xl outline-none" placeholder="e.g. AVG Mart Koramangala" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Owner Full Name</label>
            <input type="text" className="w-full p-2.5 border rounded-xl outline-none" placeholder="Applicant Name"
              value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">State Code (e.g., TN, KA, KL)</label>
            <input type="text" className="w-full p-2.5 border rounded-xl outline-none uppercase font-mono" maxLength={2}
              value={formData.state} onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})} />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">District Code (e.g., CHN, BLR, EKM)</label>
            <input type="text" className="w-full p-2.5 border rounded-xl outline-none uppercase font-mono" maxLength={3}
              value={formData.district} onChange={e => setFormData({...formData, district: e.target.value.toUpperCase()})} />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Franchise Deposit Amount (₹)</label>
            <input type="number" className="w-full p-2.5 border rounded-xl outline-none" placeholder="e.g. 200000"
              value={formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value})} />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Franchise Agreement Fee (₹)</label>
            <input type="number" className="w-full p-2.5 border rounded-xl outline-none" placeholder="e.g. 50000"
              value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} />
          </div>
        </div>

        <div className="pt-3 border-t flex justify-end gap-2">
          <button type="button" className="px-4 py-2.5 border text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50">Save Draft</button>
          <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Provision & Create Franchise
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewFranchiseSignup;