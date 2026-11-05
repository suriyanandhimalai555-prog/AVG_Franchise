import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AppVersion = () => {
  const [formData, setFormData] = useState({
    androidCurrent: '',
    androidMinimum: '',
    iosCurrent: '',
    iosMinimum: '',
    releaseNotes: '',
    forceUpdate: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch app version settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/app-settings`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setFormData({
            androidCurrent: result.data.androidCurrent || '',
            androidMinimum: result.data.androidMinimum || '',
            iosCurrent: result.data.iosCurrent || '',
            iosMinimum: result.data.iosMinimum || '',
            releaseNotes: result.data.releaseNotes || '',
            forceUpdate: result.data.forceUpdate ?? true,
          });
        }
      } catch (error) {
        console.error('Failed to load app settings:', error);
        toast.error('Failed to load version settings from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, forceUpdate: !prev.forceUpdate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/app-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('App version settings updated successfully!');
      } else {
        toast.error(result.message || 'Failed to save settings.');
      }
    } catch (error) {
      console.error('Save Error:', error);
      toast.error('Server connection failed. Make sure backend is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
          App Version <span className="text-blue-600">Control</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage minimum required native client versions, build targets, and global force-update flags.
        </p>
      </div>

      {/* Main Glass / Clean Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-10 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10 text-blue-600 font-semibold text-sm">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading version parameters...
          </div>
        )}

        {/* Sub Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-8">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 shadow-inner">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Native Client Configuration
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Outdated clients falling below minimum requirements will be blocked during startup handshake.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Version Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Android Current */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Android Current Version
              </label>
              <input
                type="text"
                name="androidCurrent"
                required
                value={formData.androidCurrent}
                onChange={handleChange}
                placeholder="e.g. 2.0.0"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            {/* Android Minimum */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Android Minimum Required Version
              </label>
              <input
                type="text"
                name="androidMinimum"
                required
                value={formData.androidMinimum}
                onChange={handleChange}
                placeholder="e.g. 2.0.0"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            {/* iOS Current */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                iOS Current Version
              </label>
              <input
                type="text"
                name="iosCurrent"
                required
                value={formData.iosCurrent}
                onChange={handleChange}
                placeholder="e.g. 1.0.0"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            {/* iOS Minimum */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                iOS Minimum Required Version
              </label>
              <input
                type="text"
                name="iosMinimum"
                required
                value={formData.iosMinimum}
                onChange={handleChange}
                placeholder="e.g. 1.0.0"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

          </div>

          {/* Release Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Release Notes / What's New
            </label>
            <textarea
              name="releaseNotes"
              rows={4}
              value={formData.releaseNotes}
              onChange={handleChange}
              placeholder="Describe bug fixes, performance upgrades, or new features in this release..."
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition resize-y placeholder-slate-400"
            />
          </div>

          {/* Bottom Actions Row */}
          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-3.5 cursor-pointer select-none" onClick={handleToggle}>
              <button
                type="button"
                role="switch"
                aria-checked={formData.forceUpdate}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.forceUpdate ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    formData.forceUpdate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div>
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Force Update Flag</span>
                <span className="text-xs text-slate-400 font-medium">
                  {formData.forceUpdate ? 'Active — restricts outdated clients.' : 'Inactive — allows optional upgrades.'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{saving ? 'Saving Changes...' : 'Save Version Settings'}</span>
            </button>

          </div>
        </form>
      </div>

    </div>
  );
};

export default AppVersion;